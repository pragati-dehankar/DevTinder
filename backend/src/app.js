const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const requestRouter = require("./routes/request");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("../src/routes/user");

// app.use("/test", (req, res) => {
//   res.send("Namaste1");
// });

// app.use((req, res) => {
//   res.send("Hello from server");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello");
// });
app.use("/", requestRouter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
      console.log("Server is listening");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!");
  });
