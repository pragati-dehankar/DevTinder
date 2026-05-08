const express = require("express");

const app = express();

app.post("/test", 
    (req, res,next) => {
  next()
},
(res,req,next)=>{
    res.send("Hey")
}
);