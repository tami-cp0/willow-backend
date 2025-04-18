import { Response } from "express";
import multer from "multer";

export interface CustomError extends Error {
    statusCode: number;
}

/**
 * Custom error handler class for HTTP responses that extends the built-in Error class.
 * Includes a status code for HTTP responses.
 */
export class ErrorHandler extends Error implements CustomError {
    public statusCode: number = 500;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Handles errors by sending a graceful HTTP response.
 * @param error - The custom error object.
 * @param response - The HTTP response object.
 */
export const handleError = (error: CustomError, response: Response) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    console.error(error); // removed for prod

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            message = "File size exceeds 10MB limit";
            statusCode = 400;
        }
    }
    
    const errorResponsePayload: any = { status: "fail", message };
    
    return response.status(statusCode).json(errorResponsePayload);
};