const app = require("./app.js");
const { PORT = 75 } = process.env;

app.listen(75, , (err)=>{
    if (err) console.log("port not open")
    console.log("server listening on port 75");
});
