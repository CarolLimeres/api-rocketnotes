const knex = require("../database/knex");

class TagsController {
  // essa classe só vai ter uma função, q vai ser de listar todas as tags cadastradas do usuário:
  async index(request, response) {
    // recuperar o user_id do parâmetro (desestruturando ele):
    const user_id = request.user.id;

    // buscar pelas tags (tabela tags):
    // filtrar essas tags pra onde seja igual ao user_id:
    // como o nome do campo de user_id aqui ta igual a como ta no banco de dados, eu nao preciso colocar user_id: user_id
    // o groupBy vai agrupar pelo campo que eu escolher e nao vai trazer elementos repetidos
    const tags = await knex("tags").where({ user_id }).groupBy("name");

    return response.json(tags);
  }
}

module.exports = TagsController;
