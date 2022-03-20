const mongoose = require('mongoose');
const Schema = mongoose.Schema

const CartSchema = new Schema({
    total: {
        type: Number,
        default: 0,
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref:'Item',
    }],

    owner: {
        type: Schema.Types.ObjectId,
        ref:'User',
   }
})

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;