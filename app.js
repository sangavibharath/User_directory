var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    

//APP CONFIG    
mongoose.connect("mongodb://localhost/camp"); 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")) ;
app.use(methodOverride("_method"))    


// Schema Setup    //MONGOOSE/MODEL CONFIG

var blogSchema = new mongoose.Schema({
   user_name:       String,
   address:       String,
   email :       String,
   contact:     {type:Number}
});

var User = mongoose.model("User",blogSchema ) ;
    
//Restfull Routes

app.get("/", function(req, res){
    res.redirect("/users");
});

//INDEX - Show all users
app.get("/users", function(req, res){
    //Get all users
    User.find({}, function(err, users){// this database
         if(err){
            console.log(err);
        } else {
            res.render("index", {users: users}); // passing the data coming from the database from  users and sending the data to users
        }
    });
});    

//NEW - Show form to create new user
app.get("/users/new", function(req, res){
    res.render("new.ejs")
});

// CREATE ROUTE
app.post("/users", function(req, res){
    //Create new user
    User.create(req.body.users, function(err, newUser){
        if(err){
            res.render("new");
        } else {
             // then redirect to index
            res.redirect("/users");
        }
    });    
});    


//SHOW: Showmore info about one user
app.get("/users/:id", function(req, res){ 
    // find the user provided with id
    User.findById(req.params.id, function(err, foundUser){
         if(err){
            res.redirect("/users");
        } else {
            // render show template with that user    
            res.render("show", {user: foundUser});
        }
    });
})



//EDIT Route
app.get("/users/:id/edit", function(req, res){ 
    // find the user provided with id
    User.findById(req.params.id, function(err, foundUser){
         if(err){
            res.redirect("/users");
        } else {
            // render show template with that user    
            res.render("edit", {user: foundUser});
        }
    });
})

//UPDATE Route
app.put("/users/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.users, function(err, updatedUser){
        if(err){
            res.redirect("/users/" + req.params.id);
            } else {
                res.redirect("/users");
            }
    });
});


//DELETE ROUTE
app.delete("/users/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/users");
            } else {
                res.redirect("/users");
            }
    });
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started!!");
});
