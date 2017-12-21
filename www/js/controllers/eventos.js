
// Route: /eventos-ligamx
ais.controller('EventsSelectCtrl', ['$scope', '$requester', function($scope, $requester){
    
}]);

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
            // Make request to Server
            $requester.setup({
                url: 'games',
                method: 'POST',
                showLoadingModal: true,
                data: {
                    sportid: $scope.selectedSport.Id,
                    tournamentid: $scope.selectedTournament.Id,
                    numjornada: $scope.numjornada,
                    player1: $scope.player1.Id,
                    player2: $scope.player2.Id,
                    playdate: $scope.playdate,
                    isactive: false
                }
            }).call(function(response){
                Modal.show(response.data.message);
                console.log(response.data);
            });
        }
    };

}]);