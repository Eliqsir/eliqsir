var url = require('url');
var http = require('http');
var juices = require('./'+process.argv[3]);


var options = url.parse(process.argv[2]);
options.method = 'POST';
options.headers = {
    'Content-Type':'application/json'
};

juices.forEach(function(juice){
    var req = http.request(options,function(res){
        res.on('data',function(data){
            console.log(data);
        });
    });

    req.on('error',function(e){
        console.log(e);
    });

    req.write(JSON.stringify(juice));
    req.end();
});


