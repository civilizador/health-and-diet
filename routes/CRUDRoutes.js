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
        
        
        //2. ALL COURSES ROUTE
            
        app.get("/all_courses",function(req, res) { 
            if(req.query.search){  
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                    Course.find({title: regex}, function(err, courses){
                        if(err) {
                            throw err   
                        } else { 
                            res.render("lessons/index",{courses: courses,currentUser:req.user});
                        }
                    });
            } else {
                    Course.find({}, function(err, courses){
                            if(err) {
                                throw err
                            } else { 
                                res.render("lessons/index",{courses: courses,currentUser:req.user}); 
                            }
                        });
                    } 
        });  
        
        //3. ALL LESSONS ROUTE
        
        app.get("/all_lessons",function(req, res) { 
            if(req.query.search){  
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                    Lesson.find({title: regex}, function(err, lessons){
                        if(err) {
                            throw err   
                        } else { 
                            res.render("lessons/index",{lessons: lessons,currentUser:req.user});
                        }
                    });
            } else {
                    Lesson.find({}, function(err, lessons){
                            if(err) {
                                throw err
                            } else { 
                                res.render("lessons/lessons_directory",{lessons: lessons,currentUser:req.user}); 
                            }
                        });
                    } 
        });  
    
        

        //3. "CREATE COURSE" ROUTE - POST request to /all_courses (page with all available courses listed)
        app.post("/all_courses", middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
            Course.create(req.body.ticket, function(err,ticket){
                if(err){
                    throw err , console.log("Something is wrong") 
                }
            //redirect back
                else {
                    res.redirect("/all_courses");
                }
            }
            );
        });
        
        //4.  CREATE NEW LESSON
        
        app.post("/lessons_directory", middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
            Lesson.create(req.body.ticket, function(err,ticket){
                if(err){
                    throw err , console.log("Something is wrong") 
                }
            //redirect back
                else {
                    res.redirect("/lessons_directory");
                }
            }
            );
        });
        
        
        //4. "SHOW" ROUTE.
        app.get("/all_courses/:id", async function (req, res) {
            let foundCourse = await Course.findById(req.params.id).populate("comments").exec()
            res.render("show", {
                course: foundCourse,
                user: req.user,
                currentUser: req.user,
            })
        });
      
        //5.  "EDIT" a particular course
        app.get("/all_courses/:id/edit", middleware.isLoggedIn, function(req, res) {
            Course.findById(req.params.id,function(err, foundCourse) {
                if(err) {
                    throw err
                    } else {
                    }
                }
            ); 
        } );
         
        //6. "UPDATE" ROUTE  
        app.put("/all_courses/:id",function(req,res){  
            Course.findByIdAndUpdate(req.params.id,req.body.ticket,function(err, updatedticket){
                if(err){
                    throw err
                    } else {
                    res.redirect("/tickets/" + req.params.id);
                }
            });
        });
        
        //7. "DELETE" ROUTE
        app.delete("/all_courses/:id", function(req, res){
             //destroy blog post
            Course.findByIdAndRemove(req.params.id, function(err)
            {    if(err) {throw err}
              //redirect to index route.
            else {res.redirect("/");}
            });
        });
        
    }

