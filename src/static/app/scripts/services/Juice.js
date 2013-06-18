app.factory('Juice',function($http){
    var juices;

    var Juice = function(data){
        angular.extend(this,data);
    };

    Juice.get = function(){
        console.log(juices)
        if(juices) return juices;

        juices = $http.get('/tempdata/all.json').then(function(response){
            return _(response.data).map(function(data){return new Juice(data)});
        });

        return juices;
    }

    window.Juice = Juice;
    return Juice;
});