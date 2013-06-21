var utils = require('./utils');
var fs = require('fs');
var $ = require('jquery');
var q = require('q');
var _ = require('underscore');

var urlTemplate = 'http://www.mtbakervapor.com/electronic-cigarette-nicotine-juice/?sort=alphaasc&page='
var currentPage = 1;
var descriptionPromises = [];

var juiceStore = [];

getJuices = function(html){
    var products = $(html).find('ul.ProductList>li');
    var j= [];
    products.each(function(){
        var details = $(this).find('div.ProductDetails a');
        var juice = {
            makerSmall:'mbv',
            maker:'Mount Baker Vapor',
            name:details.html().replace(' E Juice Baker Vapor',''),
            linkUrl: details.attr('href'),
            imageUrl:$(this).find('div.ProductImage img').attr('src')
        };
        getDetails(juice);
        j.push(juice);
    });
    return j;
}

extractDetails = function(html){
       return $(html).find('.ProductDescriptionContainer').text();
}

getDetails = function(juice){
    descriptionPromises.push(utils.getPage(juice.linkUrl)
        .then(extractDetails)
        .then(function(details){
            juice.description = details
        }));
}

control = function(juices){
    var deferred = q.defer();
    console.log('Page '+ currentPage + ' had ' + juices.length + ' juices');
    juiceStore = juiceStore.concat(juices);
    currentPage = currentPage + 1;

    if(juices.length>0){
        utils.getPage(urlTemplate+currentPage).then(getJuices).then(control).then(function(){deferred.resolve()});
    } else deferred.resolve()
    return deferred.promise;
};

utils.getPage(urlTemplate+currentPage)
    .then(getJuices).then(control)
    .then(function(){
        q.all(descriptionPromises).then(function(){
            console.log('found '+juiceStore.length+ ' juices')
            fs.writeFile('juice_dumps/mbv.json',JSON.stringify(juiceStore));
        })
    })



//var http = require('http');
//var $ = require('jquery');
//var fs = require('fs');
//
////The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//var options = {
//      host: 'www.mtbakervapor.com'
//};
//
//var pathTemplate = '/electronic-cigarette-nicotine-juice/?sort=alphaasc&page=1';
//var currentPage = 1;
//
//var juices = [];
//
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
//    var products = $(html).find('ul.ProductList>li');
//    console.log('Done with page:'+currentPage + ' '+ products.length + ' juices found.');
//    products.each(function(){
//        var details = $(this).find('div.ProductDetails a');
//      juices.push({
//          maker:'Mount Baker Vapor',
//          name:details.html(),
//          linkUrl: details.attr('href'),
//          imageUrl:$(this).find('div.ProductImage img').attr('src')
//      });
//    });
//
//    if(products.length > 0){
//        currentPage ++;
//        options.path = pathTemplate+currentPage;
//        http.request(options, callback).end();
//    }
//    else{
//        console.log('found '+juices.length+ ' juices')
//        fs.writeFile('juice_dumps/mbv.json',JSON.stringify(juices));
//    }
//
//
//};
//
//options.path = pathTemplate+currentPage;
//http.request(options, callback).end();
