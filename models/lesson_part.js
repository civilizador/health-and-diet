 
 var mongoose =         require("mongoose");
 
  //  Schema for Cources
    var lessonPartsSchema = new mongoose.Schema
    (
        {       created: {type: Date, default: Date.now},
                title: String,
                updated: String,
                related_to_lesson: String,
                url: String,
                description: String,
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