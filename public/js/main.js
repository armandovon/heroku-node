//Module
var myApp = angular.module('myApp', []);

//Controller för att lägga till ärende
myApp.controller('errandController', ['$scope', '$http', 'filterFilter', function($scope, $http, filterFilter){

    //Variabler som behövs
    $scope.errand = [];
    $scope.Filtered = $scope.errand;        //Array för filtrering
    $scope.error = "";                      //variabel för felmeddelande
    $scope.x = 0;
    $scope.filterString = "";

    //Hämta ärenden
    $http.get('/api/errands').success(function(data){
        $scope.errand = data;                                           //Lägger in alla ärenden i errand        
        $scope.Filtered = filterFilter(data, $scope.filterString);      //Filtrerar errands
        $scope.id = $scope.errand.length;                               //Tar fram senaste id:t
    });

    //Funktion för att lägga till ärende
    $scope.addErrand = function($d){

        //Kontrollerar så att det är ifyllt en beskrivning
        if(!$d == ""){
        
            $scope.error = "";      //Nollställer felmeddelandet
            
            //Tar fram nästa id
            for(i=0; i<=$scope.errand.length; i++){
                $scope.id = i + 1;
            }

            //Lägg till ärende
            $http.post('/api/errands/add', {description:$d, status:false, date:Date.now(), id:$scope.id}).success(function(){
                console.log("Ärende tillagt");
            
            });

            //Hämta ärenden
            $http.get('/api/errands').success(function(data){
                $scope.errand = data;                                           //Lägger in alla ärenden i errand        
                $scope.Filtered = filterFilter(data, $scope.filterString);      //Filtrerar errands
                $scope.id = $scope.errand.length;                               //Tar fram senaste id:t
            });
            
        }else{
            $scope.error = "ERROR: Du måste lägga till en beskrivning";
            
        } 
        
       
    }//Slut lägga till ärende


    //Funktion för att uppdatera status på ärendet
    $scope.updateStatus = function($x, $y){
        //Uppdatera ärende status,
        //Skickar med id:t samt nuvarande status
        $http.put('/api/errands/update', {id:$x, status:$y}).success(function(){

                console.log("Ärende status uppdaterat!");
                

                //Hämta ärenden
                $http.get('/api/errands').success(function(data){
                    $scope.errand = data;                                           //Lägger in alla ärenden i errand        
                    $scope.Filtered = filterFilter(data, $scope.filterString);      //Filtrerar errands
                    $scope.id = $scope.errand.length;                               //Tar fram senaste id:t
                });

            });
    }//Slut uppdatera status


    //Filter
    $scope.reverse = false;                             //För att hålla koll på ordningen
    $scope.column = 'date';                             //För att sortera på datum
    $scope.selectedItem = 'Äldst först';                //Förvald ordning
    $scope.options = ['Äldst först', 'Nyast först'];      //De val man kan välja mellan

    //Sortera på inmatning
    $scope.setFilter = function(value){
        $scope.Filtered = filterFilter($scope.errand, $scope.filterString);
    }
    
    //Sortera på när det lagts till
    $scope.selectedItemChanged = function(){
        $scope.reverse = !$scope.reverse;
        $scope.Filtered = filterFilter($scope.errand, $scope.filterString);
    }

    


}]);//Slut ärende-kontroller