var Course = require("./models/coursemod.js");
var User = require("./models/usermod.js");
var Comment = require("./models/commod.js");

var middlewareObj={};

middlewareObj.checkOwnership = function ( req, res, next )
{ 
    if(req.isAuthenticated()) 
    {
        Shift.findById(req.params.id, function(err, foundCampground)
            {   if(err) {
               req.flash("error", "Ticket not found");
               res.redirect("back");}
                 else{
                   //   does this user owns camps
                    if(foundCampground.author.id.equals(req.user._id))
                    { next();}
                    else { req.flash("error", "You don't have permission to do that");
                res.redirect("back");}
                    }
            }); 
    }                   else {     req.flash("error", "You need to be logged in to do that");
        res.redirect("back");} 
 };
 
middlewareObj.isAdmin = function ( req, res, next )
    { 
        if(req.isAuthenticated() && req.user.isAdmin === true) {
               res.render("users/adminpanel")
            }  else { 
                req.flash("error", "You are not an Admin. Admin will be reported!");
                res.redirect("back");
            } 
    };
           
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Пожалуйста войдите в систему или зарегистрируйтесь.");
    res.redirect("/login");
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