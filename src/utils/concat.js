var fs = require('fs');
var mbv = require('./juice_dumps/mbv.json');
console.log('mbv: '+mbv.length);
var tvc = require('./juice_dumps/thevaporchef.json');
console.log('tvc: '+tvc.length);


var all = mbv.concat(tvc);
console.log(all.length + ' total juices');
fs.writeFile('juice_dumps/all.json',JSON.stringify(all));

