// regra de negócio com a lógica do cadastro de usuário

// o hash é a função que vai gerar a criptografia:
const { hash, compare } = require("bcryptjs");

// importar arquivo AppError.js p usar aqui:
const AppError = require("../utils/AppError");

// inversão de dependência:
// não é dentro da classe q to dizendo q banco q vou usar
// é quem for usar essa classe que diz que banco que vai ser utilizado, ou seja
// o userRepository que tem que ser utilizado
class UserCreateService {
  constructor(userRepository) {
    // aqui eu to atribuindo o parâmetro userRepository a variável de mesmo nome
    // só que com o this assim eu deixo o userRepository disponível p classe como um todo
    //  p eu ter acesso por exemplo dentro da função de execute
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    // abstração: essa classe nao sabe como é a lógica dentro do findByEmail e nem do create
    // quem sabe é o repositório que ta responsável por manipular os dados no banco

    // verificar se o user ja existe:
    // get pra buscar por informações:
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // a função de hash precisa de 2 parâmetros:
    // primeiro é a senha e o segundo é o fator de complexidade do hash
    // onde tem uma promisse eu preciso colocar um await, nesse caso p esperar terminar de gerar a criptografia p eu poder usa-la
    const hashedPassword = await hash(password, 8);

    await this.userRepository.create({ name, email, password: hashedPassword });
  }
}

module.exports = UserCreateService;
