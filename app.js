const express = require("express");
const path = require("path");
const app = express();

// Sirve los archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, function () {
  console.log("Server is running on localhost:3000");
});
