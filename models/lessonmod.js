 
 var mongoose =         require("mongoose");
 
  //  Schema for Cources
    var lessonSchema = new mongoose.Schema
    (
        {       created: {type: Date, default: Date.now},
                title: String,
                updated: String,
                category: String,
                related_to_course: Number,
                description: String,
                parts_count: Number,
                completed: Boolean,
                lenght: String,
                lesson_parts_ids: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Parts" // ids of the lesson parts will be retrieved from Parts model
                    }
                ],
                comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment" // name of the model
                    }
                ]
        }
    );

    module.exports = mongoose.model("Lesson",lessonSchema);