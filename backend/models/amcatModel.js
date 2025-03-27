const mongoose = require('mongoose');

const amcatSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rollNo:{
            type: String,
            required: true,
        },
        amcatID:{
            type: String,
            required: true,
            unique: true,
        },
        cppScore:{
            type: Number,
        },
        automata:{
            type: Number,
        },
        quant:{
            type: Number,
        },
        english:{
            type: Number,
        },
        logical:{
            type: Number,
        },
        elqScore: {
            type: Number,
        }
    },
    {timestamps: true}
);

const Amcat = mongoose.model('Amcat', amcatSchema);
module.exports = Amcat;
