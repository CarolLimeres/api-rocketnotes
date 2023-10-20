// o objetivo desse arquivo é reunir todas as rotas da aplicação que vão estar separadas por arquivos

// importar o router do express:
const { Router } = require("express");

// importar rotas:
const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

// inicialização do router:
const routes = Router();

// toda vez q algm acessar o /users vai ser redirecionado p usersRoutes
// q é o grupo de rotas do usuário
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);

// sempre que quero exportar eu uso module.exports
// aqui to exportando o routes, que contém todas as rotas da minha aplicação:
module.exports = routes;
