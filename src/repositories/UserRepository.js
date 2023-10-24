//  arquivo p separar a responsabilidade da manipulação dos dados no banco do usuário
// lógica do banco

// importar a conexão com o banco de dados:
const sqliteConnection = require("../database/sqlite");

class UserRepository {
  async findByEmail(email) {
    // preciso do await aqui e do async em cima pq vou conectar com banco de dados
    // requisições assíncronas
    const database = await sqliteConnection();

    // verificar se o user ja existe:
    // get pra buscar por informações:
    const user = await database.get("SELECT * FROM users WHERE email = (?)", [
      email,
    ]);

    return user;
  }

  async create({ name, email, password }) {
    const database = await sqliteConnection();

    // criar user:
    // assim q cadastra esse usuário ele me devolve o id do usuário cadastrado
    const userId = await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    // vou devolver o id desse usuário cadastrado como um objeto
    // aqui dentro do objeto vai ter um id que vai receber o userId
    return { id: userId };
  }
}

module.exports = UserRepository;
