const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
// instanciando a classe:
const sessionsController = new SessionsController();

const sessionsRoutes = Router();
sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;
