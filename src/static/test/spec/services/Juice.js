app.factory('Juice',function(){
    var Juice = function(data){
        angular.extend(this,data);
    };

    Juice.get = function(id){
        var cb = id
            ? function(response){return new Form(response.data);}
            : function(response){
            response.data.forEach(function(value,index,arr){
                arr[index]=new Form(value);
            });
            return response.data;
        };

        id=(id || '');
        return $http.get('/api/forms/'+id).then(cb);
    };

    Form.prototype.save = function(){
        var form = this;
        return $http.post('/api/forms/',form).then(function(response){
            angular.extend(form,data);
            return form;
        });
    };

    Form.prototype.remove = function(){
        return $http.delete('/api/forms/'+this.id);
    }

    window.Form = Form;
    return Form;

});