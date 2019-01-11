var Course = require("./models/coursemod.js");
var User = require("./models/usermod.js");
var Comment = require("./models/commod.js");

var middlewareObj={};

    middlewareObj.checkOwnership = function ( req, res, next ){ 
        if(req.isAuthenticated()) {
            Course.findById(req.params.id, function(err, foundCourse) {   
                if(err) {
                    req.flash("error", "Ticket not found");
                    res.redirect("back");
                }   else {
                        //   does this user owns camps
                        if(foundCourse.author.id.equals(req.user._id)){ 
                            next();
                        } else { 
                            req.flash("error", "You don't have permission to do that");
                            res.redirect("back");
                            }
                    }
            }); 
        }   else {
                req.flash("error", "You need to be logged in to do that");
                res.redirect("back");
            } 
    };
 
    middlewareObj.isAdmin = function ( req, res, next ){ 
        if(req.isAuthenticated() && req.user.isAdmin === true) {
               return next();
            }  else { 
                req.flash("error", "You are not an Admin. Admin will be reported!");
                res.redirect("back");
            } 
    };
    
        middlewareObj.isPurchased = function ( req, res, next ){ 
        if(req.isAuthenticated()) {
            if (req.user.purchasedIDs.indexOf(req.body.id)!=-1){
                next();
            } else {
                req.flash("error", "You need purchase first");
                res.redirect("/all_courses");
            }
             
        } else { 
                req.flash("error", "You need to log in");
                res.redirect("/login");
        } 
    };
            
middlewareObj.isLoggedIn = function(req, res, next){
    
      if (req.isAuthenticated()){
        return next();
    }
    else {
    req.flash("error", "Пожалуйста войдите в систему или зарегистрируйтесь.");
    res.redirect("/login");
    }
};

                
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
};

           
middlewareObj.passwordMatch = function(req, res, next){
    if(req.body.password.equals(req.body.password2)){
        return next();
    }
    req.flash("error", "Пароли не совпадают");
    res.redirect("/login");
};

module.exports = middlewareObj;