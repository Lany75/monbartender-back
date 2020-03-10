const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes");

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
//app.use("src/assets");
server.use("/api/images", express.static("src/assets"));

server.use("/api", cors());

server.use("/api", routes);

server.listen(8000, () => {
  console.log("Server lancé sur le port 8000");
});
