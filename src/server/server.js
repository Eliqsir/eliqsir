var restify = require('restify');
var extend = require('extend');
var Juice = require('./Juice');
var concat = require('concat-stream');
var _ = require('underscore');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());

function send(req, res, next) {
    res.send('hello ' + req.params.name);
    return next();
}

server.get('/api/juice/:key', function(req,res,next){
    Juice.get(req.params.key.replace('.','!')).then(function(juice){
        res.json(juice);
    });
    return next();
});

server.get('/api/juice/', function(req,res,next){
    Juice.valueStream().pipe(concat(function(data){
        if(req.params.sort){
            sortSplit = req.params.sort.split(',');
            data = _.sortBy(data,sortSplit[0]);

            if(sortSplit[1] && sortSplit[1]==='desc')
                data.reverse();
        }

        if(req.params.page){
            var start = (parseInt(req.params.page)-1)*10;
            data = data.slice(start,parseInt(req.params.page)*10);
        }

        res.json(data);
    }))
    return next();
});

server.post('/api/juice/',function(req,res,next){
    Juice.put(req.body.makerSmall+'!'+req.body.name,req.body);
    res.json(req.body);
    return next();
});

server.put('/api/juice/:key',function(req,res,next){
    var key = req.params.key.replace('.','!');
    var combined;
    Juice.get(key).then(function(juice){
        combined = extend(juice,req.body);
        Juice.put(key,combined);
        res.json(combined);
    });
    return next();
});

server.del('/api/juice/:key',function(req,res,next){
    Juice.del(req.params.key.replace('.','!'));
    res.end();
    return next();
});


server.listen(8000);
