// postChunksForm is for handling multipart/form-data when file is in pieces

const fetch = require("node-fetch");
const FormData = require("form-data");

const { postFormFile } = require("./postFormFile");
const { filePieces } = require("../others/globals");
const { mergeFile } = require("../others/helpers");

const postChunksForm = (method) => (req, res) => {
  console.log("in postChunks");

  const { url } = req.query;
  const file = req.files[0];
  const body = req.body;

  console.log("body: ", body);
  console.log("file: ", file);

  const { pos, isEnd, fileName, bodyToBeSent, fileFieldName, bodyType } = body;

  let isStart = false;

  const filePieceObj = {
    pos,
    isEnd,
    file,
    ogName: fileName,
    name: file.filename,
  };

  if (filePieces.length == 0) {
    isStart = true;
  } else {
    isStart = false;
  }

  filePieces.push(filePieceObj);

  let message = "chunk uploaded";

  if (filePieceObj.isEnd === "true") {
    console.log("isEnd true");

    const { mergedFileName, mergedFileBuffer } = mergeFile();
    console.log("url: ", url);

    let mainBody;

    // const headersToBeSent = req.headers["content-type"];

    if (bodyType === "form") {
      mainBody = new FormData();

      mainBody.append(fileFieldName, Buffer.from(mergedFileBuffer), {
        filename: mergedFileName,
      });
      // if there r other text contents in form then athat also is appended
      for (let key in JSON.parse(bodyToBeSent)) {
        mainBody.append(key, bodyToBeSent[key]);
      }
      postFormFile(url, mainBody, res, method);
    } else {
      mainBody = Buffer.from(mergedFileBuffer);
      postFormFile(url, mainBody, res, method);
    }

    filePieces.splice(0, filePieces.length);

    return;
  }

  res.json({ status: "ok", message: "current part uploaded" });
  // postFormFile(url,)
};

module.exports = { postChunksForm };
