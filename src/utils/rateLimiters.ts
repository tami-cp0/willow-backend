import rateLimit from 'express-rate-limit';
import { Response, Request, NextFunction } from 'express';

const rateLimitHandler = (req: Request, res: Response, next: NextFunction, options: any) => {
    const time = options.time;
    // const url: string = req.originalUrl;

    let message = options.message ?? `Too many requests, please try again after ${time}`;

    // wip
    // const logMessage = `Rate limit exceeded for IP: ${req.ip}, on URL: ${url}, with method: ${req.method}: too many requests with [` + `${req.body?.email ? `email: ${req.body.email}` : `ID: ${req?.user?._id}`}] \n`;
    // console.log(logMessage);


    return res.status(429).json({
        status: 'fail',
        message
    });
}

/**
 * Limits requests to 100 every 5 minutes.
 */
export const minimalRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "5 minutes"
    })
});

/**
 * Limits requests to 5 per minute.
 */
export const moderateRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "1 minute"
    })
});

/**
 * Limits requests to 1 per minute.
 * like for otp and emails
 */
export const strictRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        time: "1 minute"
    })
});

// scrapped
// /**
//  * Limits requests to 1 per minute.
//  * like for otp and emails
//  */
// export const aiSearchRateLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000,
//     max: 5,
//     handler: (req, res, next) => rateLimitHandler(req, res, next, {
//         time: "1 minute",
//         message: "AI toggle can only be used 5 times per hour for free trial"
//     })
// });

/**
 * Limits requests to 10 per hour.
 * like for otp and emails
 */
export const aiChatRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    handler: (req, res, next) => rateLimitHandler(req, res, next, {
        message: "You have exceeded your free limit, Try again in an hour."
    })
});