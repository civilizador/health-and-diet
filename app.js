    const   express =           require("express");
    const   app =               express();
    const   passport =          require("passport");
    const   methodOverride =    require("method-override"); 
    const   bodyParser =        require("body-parser"); //body parser allows us to take data from forms and use req.body.parametr ex: req.body.name
    const   mongoose =          require("mongoose");
    const   flash    =          require("connect-flash");
    const   Course =            require("./models/coursemod");
    const   Lesson =            require("./models/lessonmod");
    const   User =              require("./models/usermod");
    const   middleware  =       require("./middleware.js");

    
    //APP CONFIG
    
    //  Connecting to DB 
    mongoose.connect("mongodb://civilizador:Asimssoft1@ds133353.mlab.com:33353/dietology_production");

    //  Express.js configuration
    app.use(require("express-session")({
        secret: "HArbira Mabira Abasjeidhc",
        resave: false,
        saveUninitialized: false
    }));
    app.set("view engine", "ejs");
    app.use(flash()); 
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.use(methodOverride("_method"));
    app.use(express.static(__dirname + "/public"));
    
    //   Creating a function that will check if there is a username/i.e is user loged in or not.
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;// req.user will either be empty or contain information about user from the request
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next(); 
    });
    
    //  PASSPORT.js CONFIGURATION IMPORT
    require("./services/passportConfig")
    app.use(passport.initialize());
    app.use(passport.session());
 
    
    
    //RESTFULL ROUTES

    require('./routes/authRoutes')(app);
    require('./routes/CRUDRoutes')(app);
    require('./routes/adminRoutes')(app);
    require('./routes/commentsRoutes')(app);

         
    app.listen(process.env.PORT,process.env.IP,function(){console.log("Server had been started")});