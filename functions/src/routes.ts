import express = require("express");
import DateController from "./Controllers/DateController";
import ProjectController from "./Controllers/ProjectController";
import UserController from "./Controllers/UserController";
import Middleware from "./middleware";
import ServiceController from "./Controllers/ServiceController";

const routes = express.Router();

routes.get("/", (req, res) => {
    res.status(200).send("Hello My friend!");
});

// User routes
routes.post("/user/register", UserController.create);
routes.post("/user/login", UserController.signin);
routes.post("/user/logout", UserController.signout);
routes.post("/user/reset-email", UserController.resetEmail);

// Project route
routes.get("/project", Middleware.verifyUser, ProjectController.store);
routes.post("/project/create", Middleware.verifyUser, ProjectController.create);
routes.get("/project/:id", Middleware.verifyUser, ProjectController.index);
routes.put("/project/:id", Middleware.verifyUser, ProjectController.put);
routes.delete("/project/:id", Middleware.verifyUser, ProjectController.delete);

// Service routes
routes.post("/service/sun", Middleware.verifyKey, DateController.index);
routes.post("/service/time-zone", Middleware.verifyKey, DateController.timeZone);
routes.get("/service/api-key", Middleware.verifyUser, ServiceController.getApiKey);
routes.get("/service/generate-api-key", Middleware.verifyUser, ServiceController.generateApiKey);
routes.post("/service/refresh-token", ServiceController.refreshToken);

export { routes };
