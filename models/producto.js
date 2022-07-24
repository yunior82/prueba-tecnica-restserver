const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    precio: {
        type: Number,
        default: 0
    },
    cantidad: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    tags: {
        type: String,
        default: ''
    },
    descripcion: {
        type: String,
        default: ''
    },
    info: {
        type: String,
        default: ''
    },
    valoracion: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    img: {
        type: String,
        default: ''
    }
});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema);
