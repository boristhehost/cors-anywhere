const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

// const PORT=8080
//

const { handleGet } = require("./controllers/get.js");
const { handlePostOrPut } = require("./controllers/post.js");
const { handleDelete } = require("./controllers/delete.js");
const { handleGetFile } = require("./controllers/getFile.js");
const { postChunksForm } = require("./controllers/postChunksForm.js");

//const { handlePut } = require("./controllers/put.js");

const corsOptions = {
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const bodyParser = require("body-parser");
//
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.)

const multer = require("multer");

// Create a multer instance and specify destination for uploaded files
const upload = multer({ dest: "uploads/" });

// const uploadSingle = (req, res, next) => {
//   // Find the file field dynamically
//   const fileField = Object.keys(req.body).find(
//     (key) => req.body[key] instanceof Buffer,
//   );
//   console.log("reqBody: ", req.body);
//   console.log("fileField: ", fileField);
//   // Check if a file field is found
//   if (!fileField) {
//     return res.status(400).send("No file uploaded");
//   }
//   upload.single(fileField)(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//   });
//   next();
// };
//
app.get("/cors-submit", handleGet);
app.get("/cors-submit/getfile", handleGetFile);
//
// else if(contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1){
//      console.log()
//    }
//
// else if(contentType && contentType.indexOf("multipart/form-data") !== -1){
//
//    }

app.post("/cors-submit", upload.any(), handlePostOrPut("POST"));
app.post("/cors-submit/chunks", upload.any(), postChunksForm("POST"));

app.put("/cors-submit", upload.any(), handlePostOrPut("PUT"));
app.put("/cors-submit/chunks", upload.any(), postChunksForm("PUT"));

app.delete("/cors-submit", upload.any(), handleDelete);

app.listen(PORT, () => {
  console.log("app is running in PORT ", PORT);
});
