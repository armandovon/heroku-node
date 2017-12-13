//Importera
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

//Instans av express
var app = express();

//Middleware
app.all('/*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    next();
});

//Skapar statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

//Port
var port = process.env.PORT || 8080;

//Starta servern
app.listen(port, function(){
    console.log("Server startad på " + port);
});


//Anslut till mongoDB
mongoose.connect('mongodb://dbAdmin:dbAdmin@ds133496.mlab.com:33496/errands', {useMongoClient: true});
mongoose.promise = global.promise;

var db = mongoose.connection;

//Importera shcema
var errands = require("./models/errands");

//Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

//Läs in alla ärenden
app.get('/api/errands', function(req, res){
    errands.find(function(err, errands){
        if(err){
            res.json(err);
        }else{
            res.json(errands);
        }
    });
});


//Lägg till ärenden
app.post('/api/errands/add', function(req, res){

    var errand = new errands();

    //Läs in värden
    errand.description = req.body.description;
    errand.status = req.body.status;
    errand.date = req.body.date;
    errand.id = req.body.id;

    //Spara i databasen
    errand.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json({message: "ärende tillagt"});
        }
    });
});


//Uppdatera ett ärende
app.put('/api/errands/update', function(req, res){

    id = req.body.id;               //objektets id
    status = req.body.status;       //Statusen

    //Hittar objektet med hjälp av id:t
    errands.find({id:id}, function(err, doc){

        //Ändrar statusen till antingen "false" eller "true" beroende på vilken status som är aktiv
        if(status == "true"){
            errands.update({id: id}, {$set : {"status": "false"}}, function(err,doc){
                console.log(err);
          });
        }else {
            errands.update({id: id}, {$set : {"status": "true"}}, function(err,doc){
                console.log(err);
          });
        }});
});//Slut uppdatera ärende
