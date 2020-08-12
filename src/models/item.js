const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')


const ItemSchema = new Schema ({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    name: {
        type: String,
        default: 'anonymous'
    },
    category: {
        type: String,
        enum: ['Electronics', 'Furniture', 'Clothing', 'Other'],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90,
        required: true
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180,
        required: true
    },
    contact: {
        type: String,
        required: true,
        validate(value){
            if(validator.isEmail(value) === false && validator.isMobilePhone(value) === false){
                throw new Error('Contact information is invalid')
            }
        }
    },
},  {
    timestamps: true,
});

const ItemEntry = mongoose.model('ItemEntry', ItemSchema);
module.exports = ItemEntry;