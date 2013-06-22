var extend = require('extend');
var q = require('q');
var levelup = require('levelup');
var config = require('./config.json');

var db = levelup(config.data+'Juices',{valueEncoding:'json'});

var Juice = function(data){
        extend(this,data); 
    };

Juice.get = function(key){
        var deferred = q.defer();
        db.get(key, function (err, value) {
            deferred.resolve(new Juice(value)); 
        });
        return deferred.promise; 
    };

Juice.put = function(key,value){
        var deferred = q.defer();
        db.put(key, value, function (err) {
            deferred.resolve(new Juice(value));
        });

        return deferred.promise;
    };

Juice.stream = function(options){
    return db.createReadStream(options);
};


Juice.valueStream = function(options){
    return db.createValueStream(options);
};
module.exports = Juice
