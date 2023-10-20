// esse arquivo serve p fazer a funcionalidade de salvar o arquivo no storage do disco da onde o backend tiver hospedado
// e p deletar a imagem anterior

// o fs é do próprio node e serve p lidar com manipulação de arquivos
const fs = require("fs");
// o path serve p lidar com a navegação pelos diretórios
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    // o rename serve p mudar o arquivo de lugar ou p renomear (nesse caso ta sendo usado p mudar o arquivo de lugar)
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  //   função p deletar arquivo:
  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      // o stat serve p verificar o estado do arquivo (se ele ta aberto, se ele foi corrompido...)
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    // o unlink serve p remover o arquivo:
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
