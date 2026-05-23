const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const requestRouter = require("./routes/request");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("../src/routes/user");
const http=require('http')
const cors = require("cors");
const initializeSocket = require("./utils/socket");
require("dotenv").config();
require("./utils/cronjob");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

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

const server=http.createServer(app)
initializeSocket(server)


connectDB()
  .then(() => {
    console.log("Database connection established!");
    server.listen(process.env.PORT, () => {
      console.log("Server is listening on 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!", err.message);
  });
