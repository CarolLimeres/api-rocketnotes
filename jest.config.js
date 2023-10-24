// arquivo de configuração dos testes
module.exports = {
  // com o bail true se um teste falhar ele para a execução dos próximos:
  bail: true,
  coverageProvider: "v8",

  // aqui eu vou dizer qual vai ser o padrão dos meus arquivos de teste (p nao precisar ficar procurando de arquivo em arquivo):
  // <rootDir>/src/ é p ignorar os node_modules
  // procura na pasta src dentro de qualquer pasta, um arquivo de qualquer nome q tenha .spec.js

  testMatch: ["<rootDir>/src/**/*.spec.js"],
};
