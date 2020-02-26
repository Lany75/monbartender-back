const express = require("express");

const routes = require("./routes");

const server = express();

//app.use("src/assets");

server.use("/api", routes);
server.listen(8080, () => {
  console.log("Server lancé sur le port 8080");
});
