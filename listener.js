const express = require("express");
const app = express();
const PORT = 3000;

app.listen(75, , function(err){
    if (err) console.log("port not open")
    console.log("server listening on port 75");
});
