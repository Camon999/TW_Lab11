import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import nodemailer from "nodemailer";
import { checkRole } from "../middlewares/auth.middleware";


class UserController implements Controller {
   public path = '/api/user';
   public router = Router();
   private userService = new UserService();
   private passwordService = new PasswordService();
   private tokenService = new TokenService();

   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.post(`${this.path}/create`, this.createNewOrUpdate);
       this.router.post(`${this.path}/auth`, this.authenticate);
       this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
       this.router.post("/api/user/reset-password", this.resetPassword);
       this.router.post("/api/admin/something", checkRole("admin"), (req, res) => {
    res.send("Tylko administratorzy mają dostęp!");
});

   }

   private authenticate = async (request: Request, response: Response, next: NextFunction) => {
    const { login, password } = request.body;
 
 
    try {
        const user = await this.userService.getByEmailOrName(login);
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' });
        }
 
 
        const isAuthorized = await this.passwordService.authorize(user._id, password);
        if (!isAuthorized) {
            return response.status(401).json({ error: 'Unauthorized' });
        }
 
 
        const token = await this.tokenService.create(user);
        response.status(200).json(this.tokenService.getToken(token));
    } catch (error) {
        console.error(`Validation Error: ${error.message}`);
        response.status(401).json({ error: 'Unauthorized' });
    }
 };
 
 
 private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
    const userData = request.body;
    console.log('userData', userData)
    try {
        const user = await this.userService.createNewOrUpdate(userData);
        if (userData.password) {
            const hashedPassword = await this.passwordService.hashPassword(userData.password)
            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword
            });
        }
        response.status(200).json(user);
    } catch (error) {
        console.error(`Validation Error: ${error.message}`);
        response.status(400).json({error: 'Bad request', value: error.message});
    }
 
 
 };
 
 
 private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
    const {userId} = request.params;
 
 
    try {
        const result = await this.tokenService.remove(userId);
        console.log('aaa', result)
        response.status(200).json(result);
    } catch (error) {
        console.error(`Validation Error: ${error.message}`);
        response.status(401).json({error: 'Unauthorized'});
    }
 };

 //Resetowanie hasla
     public async resetPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const userService = new UserService();
            const passwordService = new PasswordService();

            const user = await userService.getByEmailOrName(email);
            if (!user) return res.status(404).send("Użytkownik nie znaleziony!");

            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await passwordService.hashPassword(newPassword);
            await passwordService.createOrUpdate({ userId: user._id, password: hashedPassword });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: "37747@student.atar.edu.pl", pass: "tutajHaslo" }
            });

            await transporter.sendMail({
                from: "37747@student.atar.edu.pl",
                to: user.email,
                subject: "Resetowanie hasła",
                text: `Twoje nowe hasło: ${newPassword}`
            });

            res.send("Nowe hasło zostało wysłane na e-mail.");
        } catch (error) {
            console.error("Błąd resetowania hasła:", error);
            res.status(500).send("Błąd serwera.");
        }
    }
 

}

export default UserController;
