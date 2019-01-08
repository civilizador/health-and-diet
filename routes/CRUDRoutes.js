    const   mongoose =          require("mongoose");
    const   Course =            require("../models/coursemod");
    const   User =              require("../models/usermod");
    const   Lesson =            require("../models/lessonmod");
    const   middleware  =       require("../middleware.js");
    const   flash    =          require("connect-flash");
    const   categories =            ['CourseCategory1','CourseCategory2','CourseCategory3','CourseCategory4','CourseCategory5','CourseCategory6','CourseCategory7','CourseCategory8'];
      

        var courses_list=[];
            Course.find({}, function(err, course){ 
                    if(err){
                        throw err
                    }else{
                        course.forEach(function(course){
                            courses_list.push({title: course.title,
                                              id: course._id});;
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

//  COURSE ROUTES 
        
        //1. ALL COURSES ROUTE - You can choose category and list all courses related to the category
        
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
        
        
        //2.  CREATE NEW COURSE FORM
        
            app.get("/new_course",middleware.isAdmin,function(req,res){
            //  create a new ticket.
              res.render("lessons/new_course", {categories:categories});
            });
        
        
        //3. "CREATE COURSE" ROUTE LOGIC POST REQUEST
        
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
        
        // 4. REFRESH COURSE LIST BY SELECTED CATEGORY
        
            app.get("/selected_courses", middleware.isLoggedIn, function(req,res) {
                 Course.find({ category: req.query.category}, async function(err, course){
                            if(err) {
                                console.log(err);
                            } else { 
                                 console.log(course)
                                 res.send(course)
                            }
                        });
            });

        // 5. "SHOW" ROUTE COURSE.
        
            app.get("/all_courses/:id", async function (req, res) {
                let foundCourse = await Course.findById(req.params.id).populate("comments").exec()
                res.render("lessons/show_course", {
                    course: foundCourse,
                    user: req.user,
                    currentUser: req.user,
                })
            });

// LESSON ROUTES

        //1.  CREATE NEW LESSON FORM
        
            app.get("/new_lesson",middleware.isAdmin,function(req,res){
            //  create a new ticket.
                 res.render("lessons/new_lesson", {courses_list:courses_list});
            });
            
        //2. "CREATE LESSON" ROUTE LOGIC POST REQUEST     
        
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
        
        //3. ALL LESSONS ROUTE - You can choose course and list all lessons related to the course
        
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
        
        // 4. LESSON SHOW PAGE
            app.get("/all_lessons/:id", async function (req, res) {
                let foundLesson = await Lesson.findById(req.params.id).populate("comments").exec()
                res.render("lessons/show_lesson", {
                    lesson: foundLesson,
                    user: req.user,
                    currentUser: req.user,
                })
        });
        
        // 5. REFRESH LESSON LIST BY SELECTED CATEGORY
        
            app.get("/selected_lessons", middleware.isLoggedIn, function(req,res) {
                 Lesson.find({ related_to_course_name: req.query.course}, async function(err, lesson){
                            if(err) {
                                console.log(err);
                            } else { 
                                 console.log(lesson)
                                 res.send(lesson)
                            }
                        });
            });
        
//  PARTS OF LESSON  ROUTES

        //1.  CREATE NEW LESSON PART FORM
        
            app.get("/new_parts",  middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
                res.render("lessons/new_parts", {courses_list:courses_list,lesson_list:lesson_list});
            });
            
       
        
    }

