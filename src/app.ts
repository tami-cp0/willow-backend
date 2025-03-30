import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import https from 'https';
import { PrismaClient } from '@prisma/client';
import expressWs from 'express-ws';
import 'reflect-metadata';
import cron from 'node-cron';
import router from './routes';
import cache from './utils/cache';
import createChatRouter from './routes/chat';

config();

const app = express();

const wsInstance = expressWs(app);

const port: number = Number(process.env.PORT) || 3000;
const host: string = '0.0.0.0';
const backendURL: string = process.env.BACKEND_URL as string;
const frontendURL: string = process.env.FRONTEND_URL as string;

let prisma: PrismaClient = new PrismaClient();
export default prisma;

const allowedOrigins: string[] = [backendURL, frontendURL, `http://${host}:${port}`, 'http://localhost:3000', 'http://127.0.0.1:3001'];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

app.set('trust proxy', true);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const chatRouter = createChatRouter(wsInstance);
app.use('/api/v1/chat', chatRouter);

app.use(router);

const GREEN = '\x1b[32m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';

async function startServer() {
	try {
		const MAX_RETRIES = 5
		let retries = 0;

		while (retries < MAX_RETRIES) {
			try {
				await prisma.$connect();
				console.log('Prisma connected successfully.');
				break;
			} catch (error) {
				if (retries === MAX_RETRIES - 1) { throw error; }
				retries++;
				console.log(`Database Connection Retry ${retries}`);
				// wait for one second
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}

		app.listen(port, host, () => {
			console.log(GREEN, `Server live on http://${host}:${port}`);
		});
	} catch (error) {
		console.error('Failed to connect to Prisma:', error);
		console.error(RED, 'Server failed to start');
		process.exit(1);
	}
}

// to keep render and redis alive
cron.schedule('*/15 * * * *', async () => {
    if (backendURL) {
        https.get(`${backendURL}/api/v1/ping`).on('error', (error) => {
            console.error('Error pinging server:', error);
        });
    }

    if (cache.connected) {
        try {
            await cache.client.set('keep-alive-key', 'keep-alive-value', { EX: 15 * 60 });
        } catch (error) {
            console.error('Error setting keep-alive cache:', error);
        }
    }
});

startServer();
