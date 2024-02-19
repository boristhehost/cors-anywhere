const fetch = require("node-fetch");

const postFormFile = (url, bodyToBeSent, res, method) => {
  fetch(url, {
    method,
    mode: "cors",
    headers: {
      //"Content-Type": headersToBeSent,
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

module.exports = { postFormFile };
