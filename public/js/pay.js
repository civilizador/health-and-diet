    const   mongoose =          require("mongoose");
    const   Course =            require("../../models/coursemod");
    const   User =              require("../../models/usermod");
    const   Lesson =            require("../../models/lessonmod");
    const   Parts =             require("../../models/lesson_part");
    const   middleware  =       require("../../middleware.js");
 
 module.exports = (app) => {    
 app.get("/all_courses/:id/purchase", middleware.isLoggedIn,  async function (req, res) {
                let foundCourse = await Course.findById(req.params.id);
                let currentUserId = req.user._id;
                await User.update(
                            { _id: req.user._id }, 
                            { $push: { purchasedIDs: foundCourse._id } },
                        );
                            res.redirect('/all_courses')
                
                 
            });
            
}


