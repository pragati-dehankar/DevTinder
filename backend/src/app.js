const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Namaste1");
});

app.use((req, res) => {
  res.send("Hello from server");
});

app.use("/hello", (req, res) => {
  res.send("Hello");
});
app.listen(3000, () => {
  console.log("Server is listening");
});
