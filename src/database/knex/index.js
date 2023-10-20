// trazer as configs do knex:
const config = require("../../../knexfile");
//  importar knex:
const knex = require("knex");

// criar a conexão (e dizer quais são as configs de conexão:):
const connection = knex(config.development);

// exportar a conexão p ser utilizada em outros lugares da aplicação:
module.exports = connection;
