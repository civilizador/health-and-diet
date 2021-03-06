 
 var mongoose =         require("mongoose");
 
  //  Schema for Cources
    var lessonPartsSchema = new mongoose.Schema
    (
        {       created: {type: Date, default: Date.now},
                title: String,
                updated: String,
                image: String,
                related_to_lesson: String,
                related_to_course: String,
                url: String,
                description: String,
                description2: String,
                completed: Boolean,
                lenght: String,
                comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment" // name of the model
                    }
                ]
        }
    );

    module.exports = mongoose.model("Parts",lessonPartsSchema);