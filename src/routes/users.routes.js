// esse arquivo vai ficar responsável por receber a requisição e a resposta
// e vai repassar pro controller equivalente

// como criei esse outro arquivo p colocar as rotas de usuários, eu preciso
// importar o app q ta la no server.js
const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

// importar o controller:
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

// aqui to fazendo a inicialização:
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

// o middleware é uma função q vc coloca na rota p q consiga extrair a requisição, a resposta e o destino da requisição que é
// interceptada pelo middleware
// p q vc possa fazer algum tratamento antes de ir p funçao q foi de fato chamada pela rota (no caso de criar user)
// function myMiddleware(request, response, next) {
//   console.log("Você passou pelo Middleware!");

//   com o middleware eu posso fazer verificações, por ex, permitir q só
// o admin possa criar usuário:
//   if (!request.body.isAdmin) {
// qnd uma função encontra um return ela nao continua a execução, ou seja, nao vai pro next()
//     return response.json({ message: "user unauthorized" });
//   }

// o next é a função do middleware que chama o destino (chama a prox funçao a sex executada)
// q no caso aqui é a funçao de criar usuario
//   next();
// }

// como o UsersController é uma classe, eu preciso instanciar ele em memória (reservar um espaço em memória p ele):
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// nesse arquivo nao to detalhando como q vai ser processada a criação de um usuário,
// eu to passando a responsabilidade p método create q exite dentro do UsersController
usersRoutes.post("/", usersController.create);
// dentro do middleware de autenticação ele vai capturar o id do usuário q ta dentro do token de autenticação, por isso nao precisa mais passar o id aqui
usersRoutes.put("/", ensureAuthenticated, usersController.update);
// o patch serve p atualizar um campo específico, enquanto o put serve p vários:
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  userAvatarController.update
);

// preciso expor essas rotas pro server.js:
// agora estou exportando esse arquivo p qm quiser utilizar:
module.exports = usersRoutes;
