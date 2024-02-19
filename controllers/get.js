const fetch = require("node-fetch");

const handleGet = (req, res) => {
  // expecting url
  // send url as url=<encoded url form> in query parameter

  const { url } = req.query;
  console.log("url: ", url);

  fetch(url)
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

module.exports = { handleGet };
