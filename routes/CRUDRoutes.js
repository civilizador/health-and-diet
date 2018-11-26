    const   mongoose =          require("mongoose");
    const   Course =            require("../models/coursemod");
    const   User =              require("../models/usermod");
    const   Lesson =            require("../models/lessonmod");
    const   middleware  =       require("../middleware.js");
    const   flash    =          require("connect-flash");
    const   groups =            ['NOC','Operations_data','Operations_Voice','Dev_Ops','Team_Leads','CS_Tier1','CS_Tier2','CS_Tier3'];

    module.exports = (app) => {
        //1. INDEX ROUTE
    
        app.get("/", middleware.isLoggedIn, function(req, res){ 
               res.render("lessons/landing"); 
            });
            
        app.get("/all_cources",function(req, res) { 
            if(req.query.search){  
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                    Course.find({title: regex}, function(err, cources){
                        if(err) {
                            throw err   
                        } else { 
                            res.render("lessons/index",{cources: cources,currentUser:req.user});
                        }
                    });
            } else {
                    Course.find({}, function(err, cources){
                            if(err) {
                                throw err
                            } else { 
                                res.render("lessons/index",{cources: cources,currentUser:req.user}); 
                            }
                        });
                    } 
        });  
               
         // ADMIN ROUTE
            
        app.get("/adminpanel",function(req, res) {
            res.render("users/adminpanel")
        });
               
                 
              
         
        //2. "NEW" ROUTE
        app.get("/adminpanel/new", middleware.isLoggedIn, function(req, res) {
              const courseId = Math.random().toString(16).substring(5).toUpperCase()+( Math.floor( Math.random() * 100000 ) ) ;
              const category = ['Operations_data','Operations_Voice','Dev_Ops','Team_Leads','CS_Tier1','CS_Tier2','CS_Tier3'];
                res.render("lessons/new" , {courseId:courseId,currentUser:req.user,category:category})
        });
    
        //3. "CREATE" ROUTE - POST request to /all_cources (page with all available cources listed)
        app.post("/all_cources", middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
            Course.create(req.body.ticket, function(err,ticket){
                if(err){
                    throw err , console.log("Something is wrong") 
                }
            //redirect back
                else {
                    res.redirect("/tickets");
                }
            }
            );
        });
        
        //4. "SHOW" ROUTE.
        app.get("/all_cources/:id", async function (req, res) {
            let foundCourse = await Course.findById(req.params.id).populate("comments").exec()
            res.render("show", {
                course: foundCourse,
                user: req.user,
                currentUser: req.user,
            })
        });
      
        //5. 
        app.get("/all_cources/:id/edit", middleware.isLoggedIn, function(req, res) {
            Course.findById(req.params.id,function(err, foundCourse) {
                if(err) {
                    throw err
                    } else {
                        res.render("lessons/edit" , {foundCourse: foundCourse, currentUser: req.user})
                    }
                }
            ); 
        } );
         
           //6. "UPDATE" ROUTE  - when submiting edited blog post a PUT request with this information will be send to /blogs/:id
                //req.params.id -  the way it works whatever request recieved dril down to params and within params find "id"
        app.put("/all_cources/:id",function(req,res){  
            Course.findByIdAndUpdate(req.params.id,req.body.ticket,function(err, updatedticket){
                if(err){
                    throw err
                    } else {
                    res.redirect("/tickets/" + req.params.id);
                }
            });
        });
        
        //7. "DELETE" ROUTE
        app.delete("/all_cources/:id", function(req, res){
             //destroy blog post
            Course.findByIdAndRemove(req.params.id, function(err)
            {    if(err) {throw err}
              //redirect to index route.
            else {res.redirect("/");}
            });
        });
        
    }

