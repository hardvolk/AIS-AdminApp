
// Route: /eventos/:sportid
ais.controller('EventsSelectCtrl', function($requester, $routeParams){
    var vm = this;
    vm.sport = {skip_items: 0};
    vm.games = [];
    vm.tournaments = [];
    vm.teamImgUrl = app.TEAM_IMG;
    vm.hideBtn = true;

    vm.getSportInfo = function(){
        $requester.setup({
            url: 'games/get-sport-info/' + $routeParams.sportid,
            method: "GET"
        }).call(function(response){
            vm.sport = response.data;
            if(vm.sport.HasTournaments == 1) vm.getTournaments();
        });
    };

    vm.getTournaments = function (){
        $requester.setup({
            url: 'games/tournaments',
            method: 'GET',
            showLoadingModal: true,
            params: {sportid: vm.sport.Id}
        }).call(function(response){
            vm.tournaments = response.data;
        });        
    };

    vm.getGames = function(){
        vm.sport.sportid = vm.sport.Id;
        if(vm.sport.HasTournaments == 1)
            vm.sport.tournamentid = vm.sport.selectedTournament.Id;
        $requester.setup({
            url: 'games/by-sport',
            method: 'GET',
            showLoadingModal: true,
            params: vm.sport
        }).call(function(response){
            if(response.data.length > 0){
                angular.extend(vm.games, response.data);
                //vm.game = vm.games.concat(response.data);
                vm.sport.skip_items += vm.games.length;
                console.log(vm.games);
            } else vm.hideBtn = true;           
            
        }); 
    };
});


// Route: /eventos-nuevo
ais.controller('EventsCreateCtrl', ['$scope', '$requester', function($scope, $requester){
    // variables
    $scope.sportSelected = false;
    
    $scope.selectedSport = null;
    $scope.selectedTournament = null;
    $scope.player1 = null;
    $scope.player2 = null;
    $scope.sportList = [];
    $scope.tournsList = [];
    $scope.playerList = [];

    $scope.playdate = "";
    $scope.time= "";


    //Initialization time picker and date picker
    //date Picker
    var datepicker = $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,

      });


 
    // Calling first function
    getSportList();

    /* FUNCIONES  */
    function getSportList()
    {
       $requester.setup({
            url: 'games/sports',
            method: 'GET',
            showLoadingModal: true
        }).call(function(response){
            $scope.sportList = response.data;
        }); 
    }
    
    $scope.getTournaments = function ()
    {
        if($scope.selectedSport != null && $scope.selectedSport != "")
        {
            // Make request to Server
            $requester.setup({
                url: 'games/tournaments',
                method: 'GET',
                showLoadingModal: true,
                params: {sportid: $scope.selectedSport.Id}
            }).call(function(response){
                $scope.tournsList = response.data;
            });
        }// "Clean" selectedTournament
        else $scope.selectedTournament = "";
        
    };
    
    $scope.getPlayers = function ()
    {
        if($scope.selectedSport != null && $scope.selectedSport != "")
        {
            // Make request to Server
            $requester.setup({
                url: 'games/players',
                method: 'GET',
                showLoadingModal: true,
                params: {sportid: $scope.selectedSport.Id}
            }).call(function(response){
                $scope.playerList = response.data;
            });
        }
        // "Clean" players selection
        else $scope.player1 = $scope.player2 = null;
    };
    
    $scope.sendFormInfo = function ()
    {
        if(this.newEventForm.$valid)
        {
            var info = {
                sportid: $scope.selectedSport.Id,
                tournamentid: $scope.selectedTournament.Id,
                numjornada: $scope.numjornada,
                player1: $scope.player1.Id,
                player2: $scope.player2.Id,
                playdate: datepicker.pickadate('picker').get('select','yyyy-mm-dd') + " " + $scope.time,
                isactive: false
            };
            console.log(info);
            // Make request to Server
            $requester.setup({
                url: 'games',
                method: 'POST',
                showLoadingModal: true,
                data: info
            }).call(function(response){
                Modal.show(response.data.message);
                console.log(response.data);
            });
        }
    };

}]);