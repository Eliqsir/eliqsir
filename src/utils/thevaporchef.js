var $ = require('jquery');
var fs = require('fs');
var utils = require('./utils');
var url = require('url');
var q = require('q');

var pathTemplate = 'http://thevaporchef.com/collections/all?page=';
var baseUrl = url.parse(pathTemplate);
var currentPage = 1;

var juices = [];
var secondaryPromises = [];

var processDetailsPage = function(url,juice){
    secondaryPromises.push(utils.getPage(url).then(function(html){
        juice.description = $(html).find('#full_description').text();
        return true;
    }));
}

var processPage = function(num){
    var deferred = q.defer();
    utils.getPage(pathTemplate + num)
        .then(function(html){return $(html)})
        .then(function(page){
            var products = page.find('ul#coll-product-list>li');
            console.log('Done with page:'+num+ ' '+ products.length + ' juices found.');
            products.each(function(){
                var details = $(this).find('div.coll-prod-meta a');
                juice = {
                    maker:'The Vapor Chef',
                    makerSmall:'tvc',
                    name:details.html().trim(),
                    linkUrl: 'http://'+baseUrl.host+details.attr('href'),
                    imageUrl:$(this).find('img').attr('src')
                }
                processDetailsPage(juice.linkUrl,juice);
                juices.push(juice);
            });
            if(products.length>0)
              deferred.resolve(processPage(num + 1));
            else deferred.resolve();
        });
    return deferred.promise;
};

processPage(1).then(function(){
    console.log('Waiting on ' + secondaryPromises.length + ' descriptions')
    q.all(secondaryPromises).then(function(){
        fs.writeFile('juice_dumps/thevaporchef.json',JSON.stringify(juices));
    })
})


//callback = function(response) {
//      var str = '';
//
//        //another chunk of data has been recieved, so append it to `str`
//          response.on('data', function (chunk) {
//                  str += chunk;
//                    });
//
//            //the whole response has been recieved, so we just print it out here
//              response.on('end', function () {
//                pullProducts(str);
//              });
//}
//
//var pullProducts = function(html){
//    console.log(html);
//    var products = $(html).find('ul#coll-product-list>li');
//    console.log('Done with page:'+currentPage + ' '+ products.length + ' juices found.');
//    products.each(function(){
//        var details = $(this).find('div.coll-prod-meta a');
//      juices.push({
//          maker:'The Vapor Chef',
//          name:details.html().trim(),
//          linkUrl: 'http://'+options.host+details.attr('href'),
//          imageUrl:$(this).find('img').attr('src')
//      });
//    });
//
//    if(products.length > 0){
//        currentPage ++;
//        options.path = pathTemplate+currentPage;
//        http.request(options, callback).end();
//    }
//    else{
//        console.log('found '+juices.length+ ' juices');
//        console.log('written to juice_dumps/thevaporchef.json');
//        fs.writeFile('juice_dumps/thevaporchef.json',JSON.stringify(juices));
//    }
//
//
//};
//
//options.path = pathTemplate+currentPage;
//http.request(options, callback).end();
