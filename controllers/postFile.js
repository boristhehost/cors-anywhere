const fs = require("fs");
const fetch = require("node-fetch");

const postFile = (url, headersToBeSent, method, req, res) => {
  const wsStream = fs.createWriteStream("uploads/name.mp3");

  req.pipe(wsStream);
  wsStream.on("error", (error) => {
    console.error(error);
    res.statusCode = 400;
    res.json({ status: "error", description: error });
  });

  req.on("end", () => {
    wsStream.close(() => {
      const bodyToBeSent = fs.readFileSync("uploads/name.mp3");
      fs.unlinkSync("uploads/name.mp3");

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
    });
  });
};

module.exports = { postFile };
