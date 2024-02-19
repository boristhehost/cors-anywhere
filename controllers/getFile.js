const fetch = require("node-fetch");

const handleGetFile = (req, res) => {
  // expecting url
  // send url as url=<encoded url form> in query parameter

  const { url } = req.query;
  console.log("url: ", url);
  const initialTime = Date.now();

  fetch(url)
    .then((response) => response.blob())
    .then(async (blob) => {
      console.log("got blob");
      console.log("Took " + (Date.now() - initialTime) / 1000 + "s");
      //   const title = "video";

      //   const file = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // console.log("bytelength: ", buffer.byteLength());
      //   const arrayByte = new Uint8Array(arrayBuffer);

      res.writeHead(200, {
        "content-type": "application/octet-stream",
      });

      console.log("converted to buffer");
      res.write(buffer);
      //   const writeStream = fs.createWriteStream(arrayByte);

      //   res.sendFile(buffer);
      res.end();
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({ err });
    });
};

module.exports = { handleGetFile };
