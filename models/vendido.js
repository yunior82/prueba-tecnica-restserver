const { Schema, model } = require('mongoose');

const VendidoSchema = Schema({
    ventas: {
        type: Number,
        default: 1
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }
});

VendidoSchema.methods.toJSON = function () {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Vendido', VendidoSchema);