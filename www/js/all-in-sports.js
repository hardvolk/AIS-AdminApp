var ais = angular.module("aisModule", ["ngRoute"]);

ais.config(function($routeProvider) {
    $routeProvider
    .when("/authenticate", {
        templateUrl: "views/authenticate.html?v=0.0.2",
        controller : "AuthenticateController"
    })
    .when("/dashboard", {
        templateUrl: "views/dashboard.html?v=0.0.0"
    })
    .when("/eventos", {
        templateUrl : "views/eventos.html?v=0.0.0",
        //controller : "EventosController"
    })
    .when("/eventos/:sportid", {
        templateUrl: "views/eventos-deportes.html?v=0.0.2",
        controller :"EventsSelectCtrl"
    })
    .when("/eventos-nuevo", {
        templateUrl: "views/eventos-nuevo.html?v=0.0.2",
        controller : "EventsCreateCtrl"
    })
    .when("/winner_bets", {
        templateUrl: "views/winner_bets.html?v=0.0.2",
        controller : "winner_betsController"
    })
    .otherwise({ redirectTo: '/authenticate'})
    ;
});

/*
* Run Authentication
**/
ais.run(["$location", "$userAuth", "$user", function($location, $userAuth, $user){
    if(!$userAuth.isLoggedIn){
        console.log("No valid Token, you need to login");
        // Hide menu button
        $('#side-menu-open').addClass('hide');
        $location.path('/authenticate');
    }else{
        // Validate Token
        $user.get(function(user){
            //$location.path('/quiniela');
        }, function(error){
            $location.path('/authenticate');
        });        
    }
}]);

/**
* Service: Makes http request to the server and handles the response
* In order to send data in your request use:
*   attribute "data" for POST and "params" for GET
*/
ais.factory('$requester', ['$http', function($http){
    var request = {
        setup: function(configParams){
            this.config = configParams;
            return this;
        },
        config: {},
        call: function(callbackFn, errorCallbackFn){
            // Adding the API URL and 'X-Auth-Token'
            this.config.url = app.API_URL + this.config.url;
            this.config.headers = {"X-Auth-Token" : app.TOKEN};
            if(typeof this.config.showLoadingModal !== "undefined"){
                Modal.show('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>' + 
                    '<p>Espere por favor</p>',"",true);
            }
            // Making request, first param in 'then' is callback function, second is error handler
            $http(this.config).then(
                function success(response){
                    if(typeof request.config.showLoadingModal !== "undefined" && Modal.visible == true) Modal.close();
                    callbackFn(response);
                }, 
                function errorHanlder(response){
                    console.log("---ERROR RESPONSE", response);
                    console.log("RESPONSE DATA", response.data);
                    Modal.show("Ocurri&oacute; un problema al comunicarnos con nuestros servidores. Vuelve a intentarlo", "Oh Oh");
                    if(typeof errorCallbackFn !== "undefined") errorCallbackFn(response);
            });
        }
    };
    return request;
}]);

/*
* Service: User Info
**/
ais.factory('$user', ['$requester', function($requester){    
    return {
        req: $requester,
        get: function(callback){
            this.req.setup({
                url: "users/my-info",
                method: "GET"
            }).call(function(response){ // On Success
                callback(response.data);
            }, function(response){ // On Error
                Modal.show("Necesitas volver a iniciar sesión");
                return null;
            });
        }
    };
}]);

/*
* Service: User Auth
**/
ais.factory('$userAuth', ['$location', function($location){
    // Verify Storage support
    if (typeof(Storage) === "undefined") {
        console.log("NO HAY SOPORTE PARA ALMACENAMIENTO LOCAL");
        return {isLoggedIn: false}
    }

    var userAuth = {
        isLoggedIn: false,
        token: "",
        setToken: function(_token){
            app.TOKEN = _token;
            storage.setItem('token', _token);
            // Show Menu button
            $('#side-menu-open').removeClass('hide');
            this.isLoggedIn = true;
        },
        logout: function(){
            this.isLoggedIn = false;
            storage.removeItem('token');
            // Hide menu button
            $('#side-menu-open').addClass('hide');
            $location.path('/authenticate');
        }
    };

    // Verify token
    var storage = window.localStorage;
    var token = storage.getItem("token");
    if(token != null && token != ''){
        app.TOKEN = token;
        userAuth.token = token;
        userAuth.isLoggedIn = true;
    }else{
        userAuth.isLoggedIn = false;
    }
    return userAuth;
}]);