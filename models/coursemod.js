 
 var mongoose =         require("mongoose");
 
  //  Schema for Cources
    var courseSchema = new mongoose.Schema
    (
        {       created: {type: Date, default: Date.now},
                title: String,
                author: String,
                updated: String,
                category: String,
                description: String,
                lessons_count: Number,
                price: Number,
                lenght: String,
                image: String,
                comments: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment" // name of the model
                    }
                ]
        }
    );

    module.exports = mongoose.model("Course",courseSchema);