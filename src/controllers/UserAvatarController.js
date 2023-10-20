const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    // buscar os dados do usuário p atualizar de fato o avatar:
    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError(
        "Somente usuários autenticados podem mudar o avatar",
        401
      );
    }

    // se já existe uma foto desse usuário, eu preciso remover essa foto antiga p depois inserir a nova:
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    // colocar o where p atualizar o avatar só do usuário específico e não de todos:
    await knex("users").update(user).where({ id: user_id });

    // retornar usuário com a imagem atualizada
    return response.json(user);
  }
}

module.exports = UserAvatarController;
