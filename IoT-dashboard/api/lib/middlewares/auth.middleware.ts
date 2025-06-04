import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from "../modules/models/user.model";

interface AuthenticatedRequest extends Request {
    user?: { role: string };
}

export const auth = (request: Request, response: Response, next: NextFunction) => {
   let token = request.headers['x-access-token'] || request.headers['authorization'];
   if (token && typeof token === 'string') {
       if (token.startsWith('Bearer ')) {
           token = token.slice(7, token.length);
       }
       try {
           jwt.verify(token, config.JwtSecret, (err, decoded) => {
               if (err) {
                   return response.status(400).send('Invalid token.');
               }
               const user: IUser = decoded as IUser;
               next();
               return;
           });
       } catch (ex) {
           return response.status(400).send('Invalid token.');
       }
   } else {
       return response.status(401).send('Access denied. No token provided.');
   }
};

// Sprawdzanie roli (realizacja lab10)
export const checkRole = (role: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).send("Brak uprawnień!");
    }
    next();
};
