const multer = require('multer');
const path = require('path');


const tempDir = path.join(__dirname, '../', 'temp');

console.log(tempDir);

const multerConfig = multer.diskStorage({
  destination: tempDir,
  // !Якщо нам потрібно зберегти файл під іншим ім'ям
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({
  storage: multerConfig,
})


module.exports = upload;