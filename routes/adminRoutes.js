const  passport =           require("passport");
const  mongoose =           require("mongoose");
const  Course =             require("../models/coursemod");
const  Lesson =             require("../models/lessonmod")
const  User =               require("../models/usermod");
const  middleware  =        require("../middleware.js");
 


 // 1. Admin Panel Page
 
     module.exports = (app) => {    
        app.get("/adminpanel",middleware.isAdmin, function(req, res) {
            res.render("users/adminpanel")
        });
    
      //2.  "EDIT" a particular course
        app.get("adminpanel/all_courses/:id/edit", middleware.isLoggedIn, function(req, res) {
            Course.findById(req.params.id,function(err, foundCourse) {
                if(err) {
                    throw err
                    } else {
                    }
                }
            ); 
        } );
         
        //3. "UPDATE" ROUTE  
        app.put("adminpanel/all_courses/:id",function(req,res){  
            Course.findByIdAndUpdate(req.params.id,req.body.ticket,function(err, updatedticket){
                if(err){
                    throw err
                    } else {
                    res.redirect("/tickets/" + req.params.id);
                }
            });
        });
        
        //4. "DELETE" ROUTE
        app.delete("adminpanel/all_courses/:id", function(req, res){
             //destroy blog post
            Course.findByIdAndRemove(req.params.id, function(err)
            {    if(err) {throw err}
              //redirect to index route.
            else {res.redirect("/");}
            });
        });     
         
         
         
     }
     
     