const express = require("express");

const app = express();

//app.use("src/assets");

app.listen(8080, () => {
  console.log("Server lancé sur le port 8080");
});
