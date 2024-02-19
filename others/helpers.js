const fs = require("fs");
const FormData = require("form-data");

const convertToFormData = (obj, file) => {
  const formData = new FormData();

  for (let prop in obj) {
    formData.append(prop, obj[prop]);
  }

  if (file) {
    const filePath = `uploads/${file.filename}`;
    const fileData = fs.readFileSync(filePath);
    formData.append("file", Buffer.from(fileData), { filename: file.filename });
    // formData.append("fileInput", fileData, file.originalname);
    fs.unlinkSync(filePath);
  }

  return formData;
};

const convertToFileData = (file) => {
  const filePath = `uploads/${file.filename}`;
  const fileData = fs.readFileSync(filePath);
  fs.unlinkSync(filePath);
  return fileData;
};

module.exports = { convertToFormData, convertToFileData };
