const WebSocket = require('ws');
const _ = require('lodash');
const config = require('./config.json');

let client = new WebSocket("ws://" + config.vmix.hostname + ":" + config.vmix.port + "/stagedisplay")
global.data = {
    MAIN_SLIDE_TEXT: "",
    MAIN_SLIDE_NOTES: "",
    NEXT_SLIDE_TEXT: "",
    NEXT_SLIDE_NOTES: "",
  }


client.on('open', function open() {
  console.log("Connected to Vmix")
  client.send('{"pwd":"' + config.vmix.password + '","ptl":610,"acn":"ath"}') 
});

client.on('close', function open() {
  console.log("Connection to Vmix Closed")  
});


client.on('message', msg => message_handler(msg));

function message_handler(msg){
  msg = JSON.parse(msg)
  if(msg['acn'] == "fv"){
    process_stage_display_packet(msg)
  }
}


function process_stage_display_packet(msg){
    msg['ary'].forEach(element => { 
      
      if(element.acn == 'cs'){
        global.data.MAIN_SLIDE_TEXT = element.txt
      }else if(element.acn == 'csn'){
        global.data.MAIN_SLIDE_NOTES = element.txt
      }else if(element.acn == 'ns'){
        global.data.NEXT_SLIDE_TEXT = element.txt
      }else if(element.acn == 'nsn'){
        global.data.NEXT_SLIDE_NOTES = element.txt
      }else{
       console.log(element) 
      }
    }); 
  }
  
 

var http = require('http'); // Import Node.js core module

var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        
        // set response content    
        tmp = []
        tmp.push(global.data)
        res.write(JSON.stringify(tmp));
        res.end();
    
    }
    else if (req.url == "/student") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is student Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/admin") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is admin Page.</p></body></html>');
        res.end();
    
    }
    else
        res.end('Invalid Request!');

});
server.listen(config.main.server_port); //6 - listen for any incoming requests
console.log('Node.js web server at port ' + config.main.server_port + ' is running..')

console.log(config)
