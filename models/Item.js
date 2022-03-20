const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    price: {
        type: String,
    },
    img: {
        type: String,
    },
    img_details: Array,
    description: {
        type: String,
    },
    origin: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    color: String,
    size: Array,
    status: {
        type: Boolean,
        default: true,
    }
})

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;