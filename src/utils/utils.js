var q = require('q');
var http = require('http');
var $ = require('jquery');

var getPage = function(url){
    console.log('fetching: ' + url);
    var deferred = q.defer();
    var data;

    http.get(url,function(response){
        response.on('data', function (chunk) {
            data += chunk;
        });

            //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            deferred.resolve(data);
        });
    });

    return deferred.promise;
};

exports.getPage = getPage;
