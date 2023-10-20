// primeiro importar o knex:
const knex = require("../database/knex");

// segundo: criar a classe:
class NotesController {
  async create(request, response) {
    // desestruturar oq eu quero do corpo da requisição:
    const { title, description, tags, links } = request.body;
    // pegar o id do user q ta vindo pelo parâmetro:
    const user_id = request.user.id;

    // armazenar o id da nota q eu acabei de guardar (p usar na tabela de links e tags dps):
    const note_id = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    // percorrer cada item q tenho, e pra cada link q tenho eu retorno o id da nota (conforme feito em cima)
    // aqui entao eu to criando um objeto inserindo o código da nota (id da nota) q esse link ta vinculado
    // e mudando de link p url:
    // criando um objeto novo
    // o map ta formatando o dado (o [a] vira: [{note_id:8, url: "a"}])

    const linksInsert = links.map((link) => {
      return {
        note_id: note_id[0],
        url: link,
      };
    });

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map((name) => {
      return {
        note_id: note_id[0],
        name,
        user_id,
      };
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    // selecionar uma nota:
    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return response.json({
      // despejar todos os detalhes da nota:
      ...note,
      tags,
      links,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  // método responsável por listar as notas:
  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    // se tiverem tags vinculadas a uma nota, vai filtrar as notas q essa tag ta vinculada (e mostra-lás)
    // se nao tiverem tags, faz a consulta normal:
    if (tags) {
      // primeiro preciso converter as tags de um texto simples p um vetor (p poder mostrar em lista todas as tags:)
      // com o split eu transformo esse texto num array usando como delimitador a ",":
      // a "," vai separar uma tag da outra
      // fazer um map pq só me interessa a tag
      const filterTags = tags.split(",").map((tag) => tag.trim());

      // usar o whereIn p analisar baseado na tag
      // entao passar o nome da tag e o vetor q eu quero q ele compare se a tag existe ali ou nao
      // com o select eu passo um array com quais campos quero selecionar de ambas as tabelas (notes e tags)
      // p dps eu conseguir mostrar as infos das tags e das notas através do campo q elas tem em comum (inner join)
      notes = await knex("tags")
        .select([
          // qnd trabalho com mais de uma tabela sempre colocar o nome da tabela . nome do campo q quero utilizar, conforme abaixo:
          "notes.id",
          "notes.title",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .orderBy("notes.title");
    } else {
      // buscar as notas (filtrar por usuário específico e colocar em ordem alfabética):
      // e tb estou implementando a funcionalidade de buscar uma nota pelo nome dela (através do whereLike passando o title)
      // o Like ajuda a fazer pesquisa sem precisar escrever exatamente o título q eu cadastrei (só de colocar uma palavra q tenha ja consegue achar)
      // `%${title}%` fala p banco verificar tanto antes qnt dps, em qualquer parte da palavra se existir oq to pesquisando retorne ele p mim
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    // vincular as tags junto: (fazer todas as infos das tags aparecerem tb)
    // primeiro fazer um filtro p pegar todas as tags onde a tag seja igual ao id do usuário:
    const userTags = await knex("tags").where({ user_id });

    // percorrer todas as notas:
    const notesWithTags = notes.map((note) => {
      // filtrar as tags da nota:
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      // se o id da nota q ta vinculado a tag for igual ao note.id:
      return {
        // pegar todos os detalhes da nota:
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

// terceiro: exportar a classe:
module.exports = NotesController;
