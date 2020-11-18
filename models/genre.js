let mongoose = require('mongoose');

let Schema = mongoose.Schema;

const GenresSchema = new Schema({
    name:{type:String,min:3,max:100,required:true},
})

GenresSchema
.virtual('url')
.get(function(){
    return `/catalog/genre/${this._id}`
})

module.exports = mongoose.model('Genre',GenresSchema)