const app = require("./app.js");
const http = require("http");

const server = http.createServer(app);


server.listen(3002, () => {
    console.log("Captain service is running on port 3002...");
});