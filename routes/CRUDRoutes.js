    const   mongoose =          require("mongoose");
    const   Course =            require("../models/coursemod");
    const   User =              require("../models/usermod");
    const   Lesson =            require("../models/lessonmod");
    const   middleware  =       require("../middleware.js");
    const   flash    =          require("connect-flash");
    const   categories =            ['Course Category 1','Course Category 2','Course Category 3','Course Category 4','Course Category 5','Course Category 6','Course Category 7','Course Category 8'];
      

        var courses_list=[];
            Course.find({}, function(err, course){ 
                    if(err){
                        throw err
                    }else{
                        course.forEach(function(course){
                            courses_list.push(course.title);
                                courses_list = [...(new Set(courses_list))];
                        })
                        
                    }
            });
        
         var lesson_list=[];
            Lesson.find({}, function(err, lesson){ 
                    if(err){
                        throw err
                    }else{
                        lesson.forEach(function(lesson){
                            lesson_list.push({title: lesson.title,
                                              id: lesson._id});
                                lesson_list = [...(new Set(lesson_list))];
                        })
                        
                    }
            });    
  
    module.exports = (app) => {
        
        app.get("getAllCourses",function(req,res){
            res.send(courses_list)
        })
        
        //1. INDEX ROUTE
    
        app.get("/", middleware.isLoggedIn, function(req, res){ 
               res.render("lessons/landing",{ currentUser:req.user });
             });
        
        
        //2. ALL COURSES ROUTE - You can choose category and list all courses related to the category
        
        app.get("/all_Courses", middleware.isLoggedIn, function(req, res) { 
            if(req.query.search){  
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                Course.find({title: regex}, function(err, lessons){
                    if(err) {
                            throw err;   
                        } else { 
                            res.render("lessons/all_Courses",{currentUser:req.user,categories:categories });
                        }
                })
            } else {
                    Course.find({}, function(err, course){
                            if(err) {
                                throw err;
                            } else { 
                                res.render("lessons/all_Courses", {course:course,currentUser:req.user,categories:categories } ); 
                            }
                        });
                    } 
        });  
        
        
        //3.  CREATE NEW COURSE FORM
        
            app.get("/new_course",middleware.isAdmin,function(req,res){
            //  create a new ticket.
              res.render("lessons/new_course", {categories:categories});
            });
        
        

        //4. "CREATE COURSE" ROUTE LOGIC POST REQUEST
        
        app.post("/create_course",middleware.isAdmin,function(req,res){
            //  create a new ticket.
            Course.create(req.body.course, function(err,course){
                if(err){
                    throw err,
                    console.log("Something is wrong") ;
                }
            //redirect back
                else {
                    res.redirect( "/all_Courses");
                }
            }
            );
        });
        


        //5.  CREATE NEW LESSON FORM
        
            app.get("/new_lesson",middleware.isAdmin,function(req,res){
            //  create a new ticket.
                 res.render("lessons/new_lesson", {courses_list:courses_list});
            });
            
        //6. "CREATE LESSON" ROUTE LOGIC POST REQUEST     
        
            app.post("/create_lesson", middleware.isAdmin, function(req,res){
            //  create a new ticket.
            Lesson.create(req.body.lesson, function(err,lesson){
                if(err){
                    res.redirect("new_lesson");
                    throw err , console.log("Something is wrong") 
                }
            //redirect back
                else {
                    res.redirect("all_Lessons");
                }
            }
            );
        });
        
        //7. ALL LESSONS ROUTE - You can choose course and list all lessons related to the course
        
        app.get("/all_Lessons", middleware.isLoggedIn, function(req, res) { 
            if(req.query.search){  
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                Lesson.find({title: regex}, function(err, lessons){
                    if(err) {
                            throw err;   
                        } else { 
                            res.render("lessons/all_Lessons",{lessons:lessons,currentUser:req.user,categories:categories,courses_list:courses_list });
                        }
                })
            } else {
                    Lesson.find({}, function(err, lessons){
                            if(err) {
                                throw err;
                            } else { 
                                res.render("lessons/all_Lessons", {lessons:lessons,currentUser:req.user,categories:categories,courses_list:courses_list } ); 
                            }
                        });
                    } 
        });         

        //8.  CREATE NEW LESSON PART FORM
        
            app.get("/new_parts",  middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
                res.render("lessons/new_parts", {courses_list:courses_list,lesson_list:lesson_list});
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

