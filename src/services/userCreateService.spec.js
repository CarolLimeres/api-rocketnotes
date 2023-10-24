const UserCreateService = require("./UserCreateService");
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
// criação do teste de cadastrar usuário:

// o it é uma função que recebe dois parâmetros:
// o primeiro é a descrição do nosso teste (oq esse teste vai fazer)
// o segundo é a função que vai de fato executar esse teste
it("user should be create", async () => {
  // aqui eu crio um objeto user p simular os valores enviados
  // pq o teste nao vai depender do usuário fazer uma requisição (testes automatizados)
  const user = {
    name: "User Test",
    email: "user@test.com",
    password: "123",
  };

  const userRepositoryInMemory = new UserRepositoryInMemory();
  // qnd instancia o serviço eu preciso informar qual repositório/banco vou utilizar
  // o método construtor espera isso
  // só que eu preciso executar os testes de forma independente do banco de dados/infraestrutura da aplicação
  // então crio um userRepository separado só p usar nos testes p nao poluir o meu banco (q é usado em produção)
  const userCreateService = new UserCreateService(userRepositoryInMemory);
  // p usar o userCreateService eu acesso o método de execute passando p ele os dados do usuário
  // pego o retorno (q dentro vai ter o id do usuário)
  const userCreated = await userCreateService.execute(user);

  // a minha expectativa é q dentro do userCreated tenha uma propriedade id
  // com o toHaveProperty eu to verificando se existe uma propriedade "id" dentro do objeto userCreated
  // se tem o id significa que cadastrou (atribuiu esse id a um usuário e ta me devolvendo esse usuário)
  expect(userCreated).toHaveProperty("id");

  //   nos testes trabalhamos com expectativas
  // ex: a minha expectativa é que a soma de 2 + 2 seja igual a 4
  // se a minha expectativa for atendida significa q o teste passou, senão não passou
});
