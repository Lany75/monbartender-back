const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const server = express();

//app.use("src/assets");
server.use("/api/images", express.static("src/assets"));

server.use("/api", cors());

server.use("/api", routes);

server.listen(8000, () => {
  console.log("Server lancé sur le port 8000");
});
