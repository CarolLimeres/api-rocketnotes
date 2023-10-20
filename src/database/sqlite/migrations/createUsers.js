// tem q colocar o IF NOT EXISTS p nao dar conflito caso a tabela ja exista
// (senao tenta criar dnv a tabela e vai dar erro)
const createUsers = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name VARCHAR,
   email VARCHAR,
   password VARCHAR,
   avatar VARCHAR NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

module.exports = createUsers;
