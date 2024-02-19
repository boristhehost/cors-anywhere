const fetch = require("node-fetch");

const handleDelete = (req, res) => {
  // expecting url
  // send url as url=<encoded url form> in query parameter

  const { url } = req.query;
  console.log("url: ", url);

  fetch(url, {
    method: "DELETE",
    mode: "cors",
  })
    .then((response) => {
      console.log("got response in delete method");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        console.log("application/json");
        return response.json().then((data) => {
          // The response was a JSON object
          // Process your data as a JavaScript object
          res.json(data);
        });
      } else {
        console.log("text form");
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

module.exports = { handleDelete };
