var http = require('http');
var $ = require('jquery');
var fs = require('fs');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
      host: 'thevaporchef.com'
};

var pathTemplate = '/collections/all?page=';
var currentPage = 1;

var juices = [];

callback = function(response) {
      var str = '';

        //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
                  str += chunk;
                    });

            //the whole response has been recieved, so we just print it out here
              response.on('end', function () {
                pullProducts(str);
              });
}

var pullProducts = function(html){
    console.log(html);
    var products = $(html).find('ul#coll-product-list>li');
    console.log('Done with page:'+currentPage + ' '+ products.length + ' juices found.');
    products.each(function(){
        var details = $(this).find('div.coll-prod-meta a');
      juices.push({
          maker:'The Vapor Chef',
          name:details.html().trim(),
          linkUrl: 'http://'+options.host+details.attr('href'),
          imageUrl:$(this).find('img').attr('src')
      });
    });

    if(products.length > 0){
        currentPage ++;
        options.path = pathTemplate+currentPage;
        http.request(options, callback).end();
    }
    else{
        console.log('found '+juices.length+ ' juices');
        console.log('written to juice_dumps/thevaporchef.json');
        fs.writeFile('juice_dumps/thevaporchef.json',JSON.stringify(juices));
    }


};

options.path = pathTemplate+currentPage;
http.request(options, callback).end();
