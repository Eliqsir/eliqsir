app.factory('Juice', function ($http,$q) {
    var juices;

    var Juice = function (data) {
        angular.extend(this, data);
    };

    Juice.get = function () {

        juices = $http.get('/tempdata/all.json').then(function (response) {
            return _(response.data).map(function (data) {
                return new Juice(data)
            });
        });

        return juices;
    };


    Juice.wtf = function(){
        var deffe = $q.defer();

        setTimeout(function(){
            deffe.resolve([1,2,3,4]);
        },3000);
        return deffe.promise;
    };

//    Juice.query = function (query) {
 //       Juice.get().then(function(data){console.log(data)});
 //       return Juice.get().then(function (juices) {
 //           var results = [];
 //           query.split(' ').forEach(function (term) {
 //               if (term === ' ') return;
 //               results.concat(_(juices).filter(function(juice){return juice.name.indexOf(term) !== -1}));
 //           })
 //           return results;
 //       });
//
 //   };

    window.Juice = Juice;
    return Juice;
});