var extend = require('extend');
var q = require('q');
var levelup = require('levelup');

var db = levelup('/data/Juices',{valueEncoding:'json'});

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
        value.key = key;
        db.put(key, value, function (err) {
            deferred.resolve(new Juice(value));
        });

        return deferred.promise;
    };

Juice.del= function(key){
    db.del(key);
};

Juice.stream = function(options){
    return db.createReadStream(options);
};


Juice.valueStream = function(options){
    return db.createValueStream(options);
};
module.exports = Juice
