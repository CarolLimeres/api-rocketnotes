const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

// um middleware sempre recebe um next p chamar a próxima função q é destino da requisição:
function ensureAuthenticated(request, response, next) {
  // o token do usuário vai estar aqui:
  const authHeader = request.headers.authorization;

  //   verificar se o token não existe:
  if (!authHeader) {
    throw new AppError("JWT Token não informado", 401);
  }

  //   se o token existir:
  // o token é armazenado no header assim: "bare xxxxx", como nao preciso da palavra bare eu faço
  // um split p pegar só a segunda posição do array (split transforma a string em um array) pois é oq me importa
  //   e o caractere q vai ser usado como referência p quebrar um texto em string vai ser um espaço,
  //   então na primeira posição é o "bare" e na segunda é o token
  // e ja ta pegando essa segunda posição e passando p uma variável chamada token
  const [, token] = authHeader.split(" ");

  //   verificar se é um token válido:
  //  o sub é uma propriedade q eu consigo desestruturar do resultado dessa função q vai verificar se o token é válido:
  //   se for válido ele devolve o sub (dei um "apelido" (alias) p esse sub de user_id p fazer mais sentido ):
  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    // o user é uma propriedade q ainda nao existe, mas vai existir a partir de agr:
    // dentro dela crio uma propriedade chamada id e vou voltar ela pra um número e ela vai ser o user_id:
    // (pq antes, na hora de converter p um token (no SessionsController) passou ela p um texto e no banco é guardado como número)
    // aqui é o processo contrário:
    request.user = {
      id: Number(user_id),
    };

    // se der tudo certo eu chamo o next p chamar a próxima função (a função destino):
    // pq o middleware entra no caminho p verificar quem é esse usuário q ta autenticado
    return next();
  } catch {
    throw new AppError("JWT Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;
