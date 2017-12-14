ais.controller('Eventos-altaController', ['$scope', '$requester', function($scope, $requester){
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
            url: 'events/sports',
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
                url: 'events/tournaments',
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
                url: 'events/players',
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
                url: 'events',
                method: 'POST',
                showLoadingModal: true,
                data: {
                    sportid: $scope.selectedSport.Id,
                    tournamentid: $scope.selectedTournament.Id,
                    num_jornada: $scope.num_jornada,
                    player1: $scope.player1.Id,
                    player2: $scope.player2.Id,
                    playDate: $scope.playDate,
                    playTime: $scope.playTime
                }
            }).call(function(response){
                Modal.show("Juego guardado exitosamente");
            });
        }
    };

}]);