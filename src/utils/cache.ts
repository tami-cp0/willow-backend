import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient, RedisClientType } from 'redis';
import { ErrorHandler } from './errorHandler';
import { CustomJwtPayload } from '../interfaces';
import { User } from '@prisma/client';

config();

/**
 * RedisClient class handles Redis connection, OTP generation, and validation.
 * It manages the connection status and provides methods to generate and validate OTPs.
 */
class RedisClient {
	public client: RedisClientType;
	public connected: boolean = false;

	constructor() {
		this.client = createClient({
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT)
			},
		});

		this.client.on('error', (error) => {
			console.error('Failed to connect to Redis:', error);
			this.connected = false;
		});

		this.client.on('ready', async () => {
			this.connected = true;
			console.log('Redis is connected');
		});

		this.client.connect();
	}

	private checkCacheConnection() {
		if (!this.connected) {
			console.error(`Cache is down at ${new Date()}, cannot save OTP`);
			return new ErrorHandler(
				500,
				'Internal service is down, contact support.'
			);
		}
	}

	/**
	 * Blacklists the given access token.
	 * @param {string} userId - The user ID.
	 * @param {string} accessToken - The access token to blacklist.
	 * @returns {Promise<ErrorHandler | void>}
	 */
	public async blacklistAccessToken(userId: string, accessToken: string): Promise<ErrorHandler | void> {
		const decoded: CustomJwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload; 

		const jwtExp = decoded.exp as number;
		const currentTime = Math.floor(Date.now() / 1000);
		const expirationTime = jwtExp - currentTime;

		try {
			const blacklistKey = `${userId}:token-blacklist`;
			await this.client.sAdd(blacklistKey, accessToken);

			// set the set to expire when the last token in the set has expired
			await this.client.expire(blacklistKey, expirationTime);
		} catch (error) {
			console.error(error);
			return new ErrorHandler(500, 'Internal server error - Failed to blacklist access token.');
		}
	}


	/**
	 * Checks if the given access token is blacklisted.
	 * @param {string} userId - The user ID.
	 * @param {string} accessToken - The access token to check.
	 * @returns {Promise<ErrorHandler | boolean>}
	 */
	public async isAccessTokenBlacklisted(userId: string, accessToken: string): Promise<ErrorHandler | boolean> {
		try {
			const blacklistKey = `${userId}:token-blacklist`;
			return await this.client.sIsMember(blacklistKey, accessToken);
		} catch (error) {
			console.error(error);
			return new ErrorHandler(500, 'Internal server error - Failed to check if access token is blacklisted.');
		}
	}

	/**
	 * Generates and saves an OTP for the given email.
	 * @param {string} email - email to associate with the OTP.
	 * @param {string} otp - The OTP to save.
	 * @returns ErrorHandler if the cache is down.
	 */
	public async saveOTP(
		email: string, otp: string
	): Promise<void> {
		try {
			const key = `otp-${email}`;
			await this.client.set(key, otp, { EX: 5 * 60 }); // 5 minutes
		} catch (error) {
            console.error(`Failed to save otp in cache for ${email}`);
			throw new ErrorHandler(500, 'Internal server error');
		}
	}

	/**
	 * Validates the OTP for the given email.
	 * @param {string} email - The email to validate the OTP for.
	 * @param {string} otp - The OTP to validate.
	 * @returns boolean indicating if the OTP is valid or not, or ErrorHandler if the service is down.
	 */
	public async isOtpValid(
		email: string,
		otp: string
	): Promise<boolean | void> {
		try {
			const key = `otp-${email}`;
			const userOtp = await this.client.get(key);
			if (userOtp === otp) {
				return true;
			}
			return false;
		} catch (error) {
            console.error(`Failed to retreive otp in cache for ${email}`);
			throw new ErrorHandler(500, 'Internal server error');
		}
	}

	/**
	 * Stores user info in the cache with a TTL of 5 minutes.
	 * @param {User} user - The user document to store.
	 * @returns {Promise<ErrorHandler | void>}
	 */
	public async storeUser(user: User): Promise<ErrorHandler | void> {
		try {
			const key = `user-${user.id}`;
			const value = JSON.stringify(user);
			await this.client.set(key, value, { EX: 5 * 60 });
		} catch (error) {
			console.error(error);
			return new ErrorHandler(500, 'Internal server error - Failed to store user info.');
		}
	}
  
	/**
	 * Retrieves user info from the cache and converts it back to a Mongoose document.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<ErrorHandler | IUser | null>}
	 */
	public async getUser(userId: string): Promise<User | null> {
		try {
			const key = `user-${userId}`;
			const user = await this.client.get(key);
			if (user) {
				const userObject = JSON.parse(user) as User;
				return userObject;
			}
			return null;
		} catch (error) {
			console.error(error);
			throw new ErrorHandler(500, 'Internal server error - Failed to retrieve user info.');
		}
	}

  	/**
	 * Removes user info from the cache.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<ErrorHandler | void>}
	 */
	public async removeUser(userId: string): Promise<ErrorHandler | void> {
		try {
			const key = `user-${userId}`;
			await this.client.del(key);
		} catch (error) {
			console.error(error);
			return new ErrorHandler(500, 'Internal server error - Failed to remove user info.');
		}
	}
}

const cache = new RedisClient();
export default cache;