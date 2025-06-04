import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controller";
import UserController from "./controllers/user.controller";
import TokenService from "modules/services/token.service"



const app: App = new App([
    new UserController(),
    new DataController(),
   new IndexController()
]);

setInterval(() => {
    new TokenService().removeExpired();
}, 60 * 60 * 1000); // Raz na godzinę


app.listen();