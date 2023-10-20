// esse é o driver (versão) q de fato vai estabelecer a comunicação com a base de dados:
const sqlite3 = require("sqlite3");
// esse sqlite é responsável por conectar:
const sqlite = require("sqlite");
// a biblioteca path resolve os endereços de acordo com o ambiente:
const path = require("path");

// asyn pq vou lidar com conexão com base de dados
// qnd a aplicação iniciar, se o arquivo do banco de dados nao existir (e ele nao existe da primeira vez)
// ele vai criar o arquivo de forma automática
// se existir ele vai só se conectar
// td isso são steps q nao acontecem no msm momento, por isso é async

async function sqliteConnection() {
  // com o async ali em cima, aqui posso usar o await, pq vou abrir uma conexão:
  const database = await sqlite.open({
    // agr preciso passar um objeto com configurações da minha conexão
    //  primeiro, aonde quero salvar o arquivo do meu banco de dados:
    // o __dirname pega de forma automática aonde eu estou dentro do projeto (pasta)
    filename: path.resolve(__dirname, "..", "database.db"),
    // agr preciso informar qual driver vou utilizar:
    driver: sqlite3.Database,
  });

  return database;
}

module.exports = sqliteConnection;

// SGBD - Sistema Gerenciador de Banco de Dados
