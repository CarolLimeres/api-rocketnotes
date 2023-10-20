// p resolver problemas no caminho do arquivo em vários sistemas operacionais diferentes
const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    // oq for colocado aqui nesse pool vai ser executado no momento q estabelecer conexão com o banco de dados:
    pool: {
      // isso vai habilitar a funcionalidade do onDelete("CASCADE")
      // qnd, por ex, eu deletar uma nota vai deletar em cascata as tags associadas
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb),
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
    },
    useNullAsDefault: true,
  },
};
