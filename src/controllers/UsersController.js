// esse arquivo de controller vai lidar com o processamento de informações

// o hash é a função que vai gerar a criptografia:
const { hash, compare } = require("bcryptjs");

// importar arquivo AppError.js p usar aqui:
const AppError = require("../utils/AppError");

// importar a conexão com o banco de dados:
const sqliteConnection = require("../database/sqlite");

// vou usar classe aqui pq uma classe permite que eu tenha várias funções
class UsersController {
  // um controller pode ter no máx 5 funções (métodos):
  /*
   * index - GET pra listar vários registros (ex: mostrar todos os users cadastrados).
   * show - GET p exibir um registro específico (ex: mostrar as infos de um determinado user).
   * create - POST p criar um registro.
   * update - PUT p atualizar um registro.
   * delete - DELETE p remover um registro.
   */

  async create(request, response) {
    // recuperar valores enviados através do corpo da requisição:
    const { name, email, password } = request.body;

    // preciso do await aqui e do async em cima pq vou conectar com banco de dados
    // requisições assíncronas
    const database = await sqliteConnection();

    // verificar se o user ja existe:
    // get pra buscar por informações:
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // a função de hash precisa de 2 parâmetros:
    // primeiro é a senha e o segundo é o fator de complexidade do hash
    // onde tem uma promisse eu preciso colocar um await, nesse caso p esperar terminar de gerar a criptografia p eu poder usa-la
    const hashedPassword = await hash(password, 8);

    // criar user:
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // status de criado:
    return response.status(201).json();

    // se colocar .json ao invés de .send vai devolver as informações com padrão json:
    // todas as respostas devem ser devolvidas no formato json (como objeto), pq é o padrão utilizado p api's
    // o status 201 significa q foi criado
    // a utilização do status code é opcional (se nao colocar devolve o 200 q significa q a requisição foi processada com sucesso)
    // response.status(201).json({ name, email, password });
  }

  async update(request, response) {
    // desestruturar p pegar oq quero da request:
    const { name, email, password, old_password } = request.body;
    // nao precisa mais pegar o id do usuário pelo parâmetro pq ele ja ta incorporado nas requisições
    // o middleware vai pegar o id do usuário no token e vai inserir esse usuário na requisição
    const user_id = request.user.id;

    // criar conexão com banco de dados:
    const database = await sqliteConnection();

    // buscar user pelo id:
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    // verificar se o user esta tentando mudar p um email q ja existe na base de dados:
    // primeiro pegar o email q for passado e ver se ja existe na base de dados:
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    // verificar: se encontrar o userWithUpdatedEmail e se esse userWithUpdatedEmail.id for diferente do id do user (ta tentando cadastrar email q ja existe)
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // pegar o nome e o email e atualizar p novo nome e email que o user passou:
    // o name ?? user.name significa q se tiver conteúdo em name (se for atualizar nome) é p usar esse novo conteúdo, se nao existir
    // vai continuar oq ja estava (em user.name), isso serve p caso algm atualize so a senha (por ex)
    // nao perder as infos q ja tinha de nome e email
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    // se a pessoa digitou a nova senha, mas nao digitou a antiga:
    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    // comparar se a senha antiga digitada é a mesma que ta cadastrada no banco
    // tem q comparar com a senha criptografada, por isso tem q usar o compare (q foi importado la em cima):
    if (password && old_password) {
      // uso o compare seguido do await pq é assíncrono
      // e comparo a senha antiga (q digitou agr) com a senha do user q ta cadastrada no banco:
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      // se a senha antiga digitada bateu com a cadastrada no banco entao eu deixo atualizar (fazendo a criptografia novamente):
      user.password = await hash(password, 8);
    }

    // executar o update:
    // o user é objeto q eu ja atualizei:
    // DATETIME('now') é uma função do próprio banco de dados p atualizar data e hora (p ficar no padrao certinho)
    await database.run(
      `
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
     updated_at = DATETIME('now')
     WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    // retorna por padrão o status 200 de sucesso:
    return response.json();
  }
}

// p exportar a classe:
module.exports = UsersController;
