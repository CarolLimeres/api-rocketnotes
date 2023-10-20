// configuração p lidar com o tratamento de exceções (é feito nesse arquivo)
// primeiro importar o express async errors:
require("express-async-errors");
require("dotenv/config");

// importar base de dados:
const migrationsRun = require("./database/sqlite/migrations");

// dps importar o AppError:
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors");
// aqui estou importando o express:
const express = require("express");

// usar as rotas da aplicação:
// qnd nao digo qual arquivo q é p carregar, ele usa automaticamente por padrão o index.js
// e no arquivo index.js eu to juntando os grupos de rotas
const routes = require("./routes");

// só de fazer isso ja vai executar meu banco de dados:
migrationsRun();

// aqui estou inicializando o express:
const app = express();
// importando o cors ali em cima e colocando esse app.use eu to habilitando p que o backend consiga atender as requisições do front:
app.use(cors());
// preciso dizer pro node q os conteúdos q vão vir pelo corpo da requisição vão ser no formato json:
app.use(express.json());

// p buscar a imagem do usuário no backend e exibir:
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

// qnd tenho minhas rotas já importadas eu faço isso p usá-las na minha aplicação:
app.use(routes);

// o app é a nossa aplicação, nossa api utilizando o express
// o express é quem nos ajuda a gerenciar as nossas requisições http
// essa requisição pode ser do tipo get, ou seja, de leitura de dados
// o "/message" é a rota, o caminho p acessar
// dessa função consigo extrair duas infos importantes:
// request, que é a requisição q foi feita
// e o response q é o recurso q posso utilizar p fazer a resposta
// serve p enviar uma mensagem a quem solicitou essa rota
// o /: é pra definir q oq vem a seguir é um parâmetro q vai ser recuperado p trabalhar com ele dps, e nao um endereço comum
// a informação que estamos passando como um parâmetro (na barra de endereço) ta sendo
// recuperada pelo request.params.id
// os params serão utilizados p dados simples (ex, passar id de um produto)
// os parâmetros fazem parte do endereço da minha rota, portanto tenho que colocar, são obrigatórios
// app.get("/message/:id/:user", (request, response) => {
// aqui ta desestruturando o id e o user de request.params
//   const { id, user } = request.params;

//   response.send(`Mensagem ID: ${id}. Nome do usuário: ${user}. `);
// });

// os query params são opcionais, portanto nem preciso passar eles aqui
// pq ele fica flexível pra q a gente consiga obter os querys que vem através do endereço da nossa aplicação

// tratamento de exceções:
// embora o request e o next nao estejam sendo usados, tenho q manter aqui pelo padrão
app.use((error, request, response, next) => {
  // se o erro foi gerado pelo lado do cliente:
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  //   se o erro nao for pelo lado do cliente eu vou emitir um erro padrão:
  //   500 significa q é erro do lado do servidor
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// aqui estou dizendo em qual porta o express (a api) vai atender às requisições:
const PORT = process.env.PORT || 3333;

// aqui quer dizer: fica escutando nesse endereço (nessa porta) e quando a app iniciar
// vai executar essa mensagem no terminal:
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
