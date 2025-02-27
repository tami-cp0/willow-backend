import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    id: string;
    role?: string;
    email?: string;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}


// export interface IMulterS3File extends Express.Multer.File {
//     key: string;
//     location: string;
//     bucket: string;
// }