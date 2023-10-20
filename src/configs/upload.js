// arquivo de configurações p upload de imagens:
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

// TMP_FOLDER vai ser onde as imagens chegam
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
// UPLOADS_FOLDER vai ser onde as imagens vão ficar de fato
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

// multer é a biblioteca q vai ser usada p fazer o upload
const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      // p garantir q cada usuário tenha um arquivo com nome único eu vou fazer esse hash:
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
};
