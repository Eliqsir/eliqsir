app.factory('Juice', function ($http,$q) {
    var juices;

    var Juice = function (data) {
        angular.extend(this, data);
    };

    Juice.get = function () {

        juices = $http.get('/api/juice/').then(function (response) {
            return _(response.data).map(function (data) {
                return new Juice(data)
            });
        });

        return juices;
    };

    window.Juice = Juice;
    return Juice;
});