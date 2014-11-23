var http = require('http'), 
    server; 

before(function() { 
  server = http.createServer(require('../../server')); 
  server.listen(0); 
  browser.baseUrl = 'http://'+ server.address().address +':'+ server.address().port; 
}); 

after(function(){
  server.close(); 
});