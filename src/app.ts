import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from "dotenv";
import router from "./routes";

config()

const app = express();

const port: number = Number(process.env.PORT) || 3000;
const host: string = '0.0.0.0';
const serverURL: string = process.env.BACKEND_URL as string;

const allowedOrigins: string[] = [serverURL, `http://${host}:${port}`];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)


app.listen(port, host, () => {
    console.log(`Listening on http://${host}:${port}`);
})