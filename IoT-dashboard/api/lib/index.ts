import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from "./controllers/data.controller";
import UserController from "./controllers/user.controller";
import TokenService from "modules/services/token.service"
import Controller from 'interfaces/controller.interface';
import DataService from 'modules/services/data.service';
import UserService from 'modules/services/user.service';
import PasswordService from 'modules/services/password.service';


//Do lab11 (zeby bylo DI)
function createControllers(): Controller[] {
  const userService = new UserService();
  const passwordService = new PasswordService();
  const tokenService = new TokenService();
  const dataService = new DataService();

  return [
    new UserController(userService, passwordService, tokenService),
    new DataController(dataService),
    new IndexController()
  ];
}

const app: App = new App(createControllers());

setInterval(() => {
  new TokenService().removeExpired();
}, 60 * 60 * 1000);

app.listen();