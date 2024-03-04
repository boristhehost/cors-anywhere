const fs = require("fs");
const FormData = require("form-data");
const { filePieces } = require("./globals");

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
const getLast = (arr) => {
  if (arr.length > 0) return arr[arr.length - 1];
  else {
    return null;
  }
};

const mergeFile = () => {
  // mergeFile will happen when only last filepiece is recieved so now
  // it will merge

  const arrBuffer = [];
  let ogname = "";
  for (let filePiece of filePieces) {
    const pieceData = fs.readFileSync(`uploads/${filePiece.name}`);
    fs.unlinkSync(`uploads/${filePiece.name}`);
    arrBuffer.push(pieceData);
    ogname = filePiece.ogName;
  }

  console.log("arrBuffer: ", arrBuffer);

  const mergedFileBuffer = Buffer.concat(arrBuffer);
  // fs.writeFileSync(`uploads/${ogname}`, mergedFileBuffer);
  return { mergedFileBuffer, mergedFileName: ogname };
};

module.exports = { convertToFormData, convertToFileData, getLast, mergeFile };
