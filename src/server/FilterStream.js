var Stream = require('stream');

var FilterStream = function(filterFun){
    var s = new Stream;
    s.writable = true;
    s.readable = true;

    s.write = function (obj) {
        if(filterFun(obj))
            s.emit('data',obj);
    };

    s.end = function (obj) {
        if (arguments.length && filterFun(obj))
            s.emit('data',obj);

        s.emit('end');
        s.writable = false;
    };

    s.destroy = function () {
        s.writable = false;
    };

    return s;
}


module.exports = FilterStream;