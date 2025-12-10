const app = require("./app.js");
const http = require("http");

const server = http.createServer(app);


server.listen(3001, () => {
    console.log("User service is running on port 3001...");
});