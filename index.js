// Loads the module
const http = require('http');  

const server=http.createServer((req,res)=>{
    // Text to the body
    res.write('Hello Mahesh!')  

    // Telling server that all header and body response has been sent 
    res.end()                   
})

// Defining port for the server to run
server.listen(3000, () => {                       

    //Message to print on the console after a successful run
    console.log('Server running on port 3000');   
  });
