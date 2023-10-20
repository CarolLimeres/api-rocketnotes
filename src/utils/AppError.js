// esse arquivo vai servir p padronizar qual é o tipo de mensagem
// que vai aparecer quando eu tiver algum tipo de exceção

class AppError {
  // qnd eu crio as variáveis aqui no topo faz com que toda a minha
  // classe tome conhecimento delas, consiga acessar elas
  message;
  statusCode;

  // o método construtor é um método que é carregado automaticamente
  // qnd a classe é instanciada (toda classe tem)
  // aqui eu vou deixar por padrão o status code 400 (que é qnd tem algum erro por parte do cliente)
  constructor(message, statusCode = 400) {
    // qnd eu uso o this aqui, significa q quero pegar a message que vai chegar pelo constructor da classe
    // e to repassando ela p message la de cima (do contexto global)
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
