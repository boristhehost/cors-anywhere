const { postFormFile } = require("./postFormFile");
const {
  convertToFormData,
  convertToFileData,
} = require("../others/helpers.js");
const fetch = require("node-fetch");
const { postFile } = require("./postFile");

const handlePostOrPut = (method) => (req, res) => {
  const { url } = req.query;
  // console.log("query: ", req.query);
  console.log(req.headers);
  // console.log("params: ", req.params);

  const body = req.body;
  console.log("url: ", url);
  console.log("body: ", body);
  let file;

  const headersToBeSent = req.headers["content-type"];
  let bodyToBeSent = "";

  if (headersToBeSent && headersToBeSent.indexOf("application/json") != -1) {
    bodyToBeSent = JSON.stringify(body);
  } else if (
    headersToBeSent &&
    headersToBeSent.indexOf("application/x-www-form-urlencoded") !== -1
  ) {
    bodyToBeSent = new URLSearchParams(body);
  } else if (
    headersToBeSent &&
    headersToBeSent.indexOf("multipart/form-data") !== -1
  ) {
    console.log("multipart");
    const files = req.files;
    console.log("files: ", files);
    file = files[0];

    bodyToBeSent = convertToFormData(body, file);
    console.log("file: ", file);
    console.log("bodyToBeSent: ", bodyToBeSent);
    postFormFile(url, bodyToBeSent, res, method);
    return;
  } else {
    // body is file itself
    // const files = req.files;
    // console.log("files: ", files);
    // file = files[0];
    // bodyToBeSent = convertToFileData(file);
    // console.log("bodyToBeSent: ", bodyToBeSent);
    // postFormFile(url, bodyToBeSent, res, method);
    postFile(url, headersToBeSent, method, req, res);
    return;
  }

  fetch(url, {
    method,
    mode: "cors",
    headers: {
      "Content-Type": headersToBeSent,
    },
    body: bodyToBeSent,
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then((data) => {
          // The response was a JSON object
          // Process your data as a JavaScript object
          res.json(data);
        });
      } else {
        return response
          .text()
          .then((text) => {
            // The response wasn't a JSON object
            // Process your text as a String
            res.send(text);
          })
          .catch((err) => {
            console.log("err: ", err);
            res.status(500).send({ err });
          });
      }
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({ err });
    });
};

module.exports = { handlePostOrPut };
