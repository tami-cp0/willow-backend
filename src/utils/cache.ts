import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient, RedisClientType } from 'redis';
import { ErrorHandler } from './errorHandler';

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

	// /**
	//  * Blacklists the given access token.
	//  * @param {string} userId - The user ID.
	//  * @param {string} accessToken - The access token to blacklist.
	//  * @returns {Promise<ErrorHandler | void>}
	//  */
	// public async blacklistAccessToken(userId: mongoose.Schema.Types.ObjectId, accessToken: string): Promise<ErrorHandler | void> {
	// 	this.checkCacheConnection();

	// 	const decoded: CustomJwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload; 

	// 	const jwtExp = decoded.exp as number;
	// 	const currentTime = Math.floor(Date.now() / 1000);
	// 	const expirationTime = jwtExp - currentTime;

	// 	try {
	// 		const blacklistKey = `${userId}:blacklist`;
	// 		this.client.sAdd(blacklistKey, accessToken);

	// 		// set the set to expire when the last token in the set has expired
	// 		this.client.expire(blacklistKey, expirationTime);
	// 	} catch (error) {
	// 		return new ErrorHandler(500, 'Internal server error - Failed to blacklist access token.');
	// 	}
	// }


// 	/**
//  * Checks if the given access token is blacklisted.
//  * @param {string} userId - The user ID.
//  * @param {string} accessToken - The access token to check.
//  * @returns {Promise<ErrorHandler | boolean>}
//  */
// public async isAccessTokenBlacklisted(userId: mongoose.Schema.Types.ObjectId, accessToken: string): Promise<ErrorHandler | boolean> {
//     this.checkCacheConnection();

//     try {
//         const blacklistKey = `${userId.toString()}:blacklist`;
//         return await this.client.sIsMember(blacklistKey, accessToken);
//     } catch (error) {
// 		return new ErrorHandler(500, 'Internal server error - Failed to blacklist access token.');
//     }
// }


	/**
	 * Generates and saves an OTP for the given email.
	 * @param email - email to associate with the OTP.
	 * @param {string} otp - The OTP to save.
	 * @returns ErrorHandler if the cache is down.
	 */
	public async saveOTP(
		email: string, otp: string
	): Promise<void> {
		try {
			await this.client.set(email, otp, { EX: 5 * 60 * 1000 }); // 5 minutes
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
			const userOtp = await this.client.get(email);
			if (userOtp === otp) {
				return true;
			}
			return false;
		} catch (error) {
            console.error(`Failed to retreive otp in cache for ${email}`);
			throw new ErrorHandler(500, 'Internal server error');
		}
	}

	// /**
	//  * Stores user info in the cache with a TTL of 5 minutes.
	//  * @param {IUser} user - The user document to store.
	//  * @returns {Promise<ErrorHandler | void>}
	//  */
	// public async storeUser(user: IUser): Promise<ErrorHandler | void> {
	// 	this.checkCacheConnection();
	
	// 	try {
	// 		const key = `user-${user._id}`;
	// 		const value = JSON.stringify(user.toObject());
	// 		await this.client.set(key, value, { EX: 5 * 60 });
	// 		console.log('object: ', user.toObject());
	// 	} catch (error) {
	// 		console.error(error);
	// 		return new ErrorHandler(500, 'Internal server error - Failed to store user info.');
	// 	}
	// }
  
	// /**
	//  * Retrieves user info from the cache and converts it back to a Mongoose document.
	//  * @param {string} userId - The user ID.
	//  * @returns {Promise<ErrorHandler | IUser | null>}
	//  */
	// public async getUser(userId: string | mongoose.Schema.Types.ObjectId): Promise<ErrorHandler | IUser | null> {
	// 	this.checkCacheConnection();
	
	// 	try {
	// 		const key = `user-${userId}`;
	// 		const user = await this.client.get(key);
	// 		if (user) {
	// 			const userObject = JSON.parse(user);
	// 			return User.hydrate(userObject);
	// 		}
	// 		return null;
	// 	} catch (error) {
	// 		console.error(error);
	// 		return new ErrorHandler(500, 'Internal server error - Failed to retrieve user info.');
	// 	}
	// }

  	// /**
	//  * Removes user info from the cache.
	//  * @param {string} userId - The user ID.
	//  * @returns {Promise<ErrorHandler | void>}
	//  */
	// public async removeUser(userId: string | mongoose.Schema.Types.ObjectId): Promise<ErrorHandler | void> {
	// 	this.checkCacheConnection();
	
	// 	try {
	// 		const key = `user-${userId}`;
	// 		await this.client.del(key);
	// 	} catch (error) {
	// 		console.error(error);
	// 		return new ErrorHandler(500, 'Internal server error - Failed to remove user info.');
	// 	}
	// }
}

const cache = new RedisClient();
export default cache;