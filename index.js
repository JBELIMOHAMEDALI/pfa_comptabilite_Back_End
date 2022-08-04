const http = require('http')
const app = require('./app')
const server = http.createServer(app);
const port =5001||process.env.SERVER_PORT;
server.listen(port,()=>console.log(`Server running on port ${port}`));