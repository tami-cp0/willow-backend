import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import https from 'https';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import router from './routes';
import cache from './utils/cache';

config();

const app = express();

const port: number = Number(process.env.PORT) || 3000;
const host: string = '0.0.0.0';
const backendURL: string = process.env.BACKEND_URL as string;
const frontendURL: string = process.env.FRONTEND_URL as string;

let prisma: PrismaClient = new PrismaClient();
export default prisma;

const allowedOrigins: string[] = [backendURL, frontendURL, `http://${host}:${port}`];

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

app.use(router);

const GREEN = '\x1b[32m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';

async function startServer() {
	try {
		await prisma.$connect();
		console.log('Prisma connected successfully.');

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
setInterval(async () => {
    if (backendURL) {
        https.get(`${backendURL}/api/v1/ping`).on('error', (error) => {
            console.error('Error pinging server:', error);
        });
    }

    if (cache.connected) {
        await cache.client.set('keep-alive-key', 'keep-alive-value', { EX: 15 * 60 });
    }
},  15 * 60 * 1000); // 15 minutes

startServer();
