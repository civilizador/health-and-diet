 
 var mongoose =         require("mongoose");
 
  //  Schema for Cources
    var lessonSchema = new mongoose.Schema
    (
        {       created: {type: Date, default: Date.now},
                title: String,
                updated: String,
                category: String,
                related_to_course: Number,
                lesson_parts_scr: Array,
                description: String,
                parts_count: Number,
                lenght: String,
                comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment" // name of the model
                    }
                ]
        }
    );

    module.exports = mongoose.model("Lesson",lessonSchema);