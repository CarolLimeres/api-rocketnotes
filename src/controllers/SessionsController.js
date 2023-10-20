const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  // vai envolver comunicação com banco de dados por isso é async
  async create(request, response) {
    const { email, password } = request.body;

    // verificar se o usuário existe na base de dados:
    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail e /ou senha incorreta", 401);
    }

    // pego a senha q o usuário digitou (através do corpo da requisição) e comparo com a senha cadastrada no banco de dados:
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e /ou senha incorreta", 401);
    }

    // frase secreta e tempo de expiração q criei no arquivo de auth:
    const { secret, expiresIn } = authConfig.jwt;
    // criar o token de fato:
    const token = sign({}, secret, {
      // o subject é o conteúdo que quero inserir no token
      // String (com o s maiúsculo) ta convertendo p texto
      subject: String(user.id),
      expiresIn,
    });

    return response.json({ user, token });
  }
}

module.exports = SessionsController;
