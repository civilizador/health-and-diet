    const   mongoose =          require("mongoose");
    const   Course =            require("../models/coursemod");
    const   User =              require("../models/usermod");
    const   Lesson =            require("../models/lessonmod");
    const   Parts =             require("../models/lesson_part");
    const   middleware  =       require("../middleware.js");
    const   flash    =          require("connect-flash");
    const   categories =        ['CourseCategory1','CourseCategory2','CourseCategory3','CourseCategory4','CourseCategory5','CourseCategory6','CourseCategory7','CourseCategory8'];
    const   aws =               require('aws-sdk');
    const   multer =            require('multer');
    const   multerS3 =          require('multer-s3');  

    // // AWS CONFIGURATION
    // aws.config.update({
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // region: 'eu-west-1'
    // });
    // const s3 = new aws.S3();
    
    // // MULTER CONFIGURATION
    // var upload = multer({
    //     storage: multerS3({
    //         s3: s3,
    //         acl: 'public-read',
    //         bucket: 'andop.online',
    //         key: function (req, file, cb) {
    //             console.log(file);
    //             cb(null, file.originalname); //use Date.now() for unique file keys
    //         }
    //     })
    // });
    
    
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
                    req.flash("error", "Произошла ошибка. Курс не был создан. Пожалуйста попробуйте снова.");
                    res.redirect( "/create_course");
                    console.log("Something is wrong") ;
                }
            //redirect back
                else {
                    req.flash("success", "Курс успешно создан. Вернитесь в админ панель чтобы добавить уроки.");
                    res.redirect( "/all_Courses");
                }
            }
            );
        });
        
        // 4. REFRESH COURSE LIST BY SELECTED CATEGORY
        
            app.get("/selected_courses", middleware.isLoggedIn, function(req,res) {
                 Course.find({ category: req.query.category}, async function(err, course){
                            if(err) {
                            req.flash("error", "Произошла ошибка.Пожалуйста попробуйте снова.");
                                console.log(err);
                            } else { 
                                 console.log(course)
                                 res.send(course)
                            }
                        });
            });

        // 5. "SHOW" ROUTE COURSE.
        
            app.get("/all_courses/:id", middleware.isLoggedIn,  async function (req, res) {
                let foundCourse = await Course.findById(req.params.id);
                Lesson.find({ related_to_course_name: foundCourse.title}, async function(err, lessons){
                            if(err) {
                                console.log(err);
                            } else { 
                                 
                                 res.render("lessons/show_course", {
                                    lessons: lessons,
                                    user: req.user,
                                    currentUser: req.user,
                                })
                            }
                });
                 
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
                });
            });
        
        
        // 3. LESSON SHOW PAGE
            app.get("/all_lessons/:id", async function (req, res) {
                    let foundLesson = await Lesson.findById(req.params.id).populate("comments").exec()
                    res.render("lessons/show_lesson", {
                        lesson: foundLesson,
                        user: req.user,
                        currentUser: req.user,
                    })
            });
        
        // 4. RETRIEVE LESSONS BY COURSE NAME SELECTION
            app.get("/get_lesson", middleware.isLoggedIn, async function (req, res) {
                let foundCoursebyId = await Course.findById(req.query.id)
                Lesson.find({ related_to_course_name: foundCoursebyId.title}, async function(err, lessons){
                            if(err) {
                                console.log(err);
                            } else { 
                                 res.send(lessons)
                            }
                });
            });
        
        
//  PARTS OF LESSON  ROUTES

        //1.  CREATE NEW LESSON PART FORM
        
            app.get("/new_parts",  middleware.isLoggedIn, function(req,res){
            //  create a new ticket.
                res.render("lessons/new_parts", {courses_list:courses_list,lesson_list:lesson_list});
            });
            
            //2. "CREATE LESSON PART" ROUTE LOGIC POST REQUEST     
        
            app.post("/create_part", middleware.isAdmin, function(req,res){
            //  create a new ticket.
                Parts.create(req.body.part, function(err,lesson){
                    if(err){
                        req.flash("error", "Произошла ошибка. Курс не был создан. Пожалуйста попробуйте снова.");
                        res.redirect("new_parts");
                        console.log("Something is wrong") 
                    }
                //redirect back
                    else {
                        req.flash("success", "Часть успешно добавлена в урок.");
                        res.redirect("/new_parts");
                    }
                }
                );
            });
        
            // 3. SHOW PAGE FOR SINGLE PART
            
            app.get('/parts/:id', middleware.isLoggedIn, async function(req,res){
                console.log(req.params.id)
                let all_parts = await Parts.find({});
                Parts.find({_id:req.params.id} ,function(err, part) {
                    if(err){
                        req.flash("error", "DB Error please try again")
                    }else{
                        res.render('lessons/part_show',{part,currentUser:req.user, all_parts})
                    }
                    
                })
            })
            
            // 4. RETRIEVE LESSON PARTS BY LESSON ID
        
            app.get("/selected_lesson_parts", middleware.isLoggedIn, async function(req,res) {
                console.log(req.query.lesson_id)
                let parts = await Parts.find({ related_to_lesson: req.query.lesson_id}); 
                 console.log(parts);
                    res.send(parts)
                            
                     
            });
        
    }

