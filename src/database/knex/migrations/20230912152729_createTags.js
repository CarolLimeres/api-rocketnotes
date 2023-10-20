exports.up = (knex) =>
  knex.schema.createTable("tags", (table) => {
    table.increments("id");
    // notNullable() significa q esse campo nao pode ser nulo
    table.text("name").notNullable();

    // .onDelete("CASCADE") significa q se eu apagar uma nota q essa tag ta vinculada , a tag tb vai ser apagada automaticamente
    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
  });

exports.down = (knex) => knex.schema.dropTable("tags");
