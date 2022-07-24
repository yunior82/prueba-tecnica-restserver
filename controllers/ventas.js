const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, Vendido } = require('../models');

const coleccionesPermitidas = [
    'vendidos',
    'ganancia'
];

// const buscarUsuarios = async (termino = '', res = response) => {

//     const esMongoID = ObjectId.isValid(termino); // TRUE 

//     if (esMongoID) {
//         const usuario = await Usuario.findById(termino);
//         return res.json({
//             results: (usuario) ? [usuario] : []
//         });
//     }

//     const regex = new RegExp(termino, 'i');
//     const usuarios = await Usuario.find({
//         $or: [{ nombre: regex }, { correo: regex }],
//         $and: [{ estado: true }]
//     });

//     res.json({
//         results: usuarios
//     });

// }

// const buscarCategorias = async (termino = '', res = response) => {

//     const esMongoID = ObjectId.isValid(termino); // TRUE 

//     if (esMongoID) {
//         const categoria = await Categoria.findById(termino);
//         return res.json({
//             results: (categoria) ? [categoria] : []
//         });
//     }

//     const regex = new RegExp(termino, 'i');
//     const categorias = await Categoria.find({ nombre: regex, estado: true });

//     res.json({
//         results: categorias
//     });

// }


const queryBusqueda = async (req, res = response) => {

    const { limite = 10, desde = 0, nombre = '', categoria = '', tags = '', descripcion = '', info = '' } = req.query;
    const query = { estado: true };

    if (categoria !== '') {
        const esMongoID = ObjectId.isValid(categoria); // TRUE
        if (!esMongoID) {
            return res.status(400).json('La Categoria no es valida');
        }
        query.categoria = categoria;
    }

    if (nombre !== '') {
        const regex_nombre = new RegExp(nombre, 'i');
        query.nombre = regex_nombre;
    }

    if (tags !== '') {
        const regex_tags = new RegExp(tags, 'i');
        query.tags = regex_tags;
    }

    if (descripcion !== '') {
        const regex_descripcion = new RegExp(descripcion, 'i');
        query.descripcion = regex_descripcion;
    }

    if (info !== '') {
        const regex_info = new RegExp(info, 'i');
        query.info = regex_info;
    }

    return query;
}




// const totalBusquedaProductos = async (req, res = response) => {

//     const { limite = 10, desde = 0 } = req.query;

//     const productos = await Producto.countDocuments(await queryBusqueda(req, res));

//     res.json({
//         total: productos
//     });

// }


// const productosSinStock = async (req, res = response) => {

//     const { limite = 10, desde = 0 } = req.query;

//     const productos = await Producto.find({ cantidad: 0, estado: true })
//         .populate('categoria', 'nombre')
//         .populate('usuario', 'nombre')
//         .skip(Number(desde))
//         .limit(Number(limite));

//     res.json({
//         results: productos
//     });

// }


// const buscarProductosPorCategorias = async (termino = '', res = response) => {

//     const esMongoID = ObjectId.isValid(termino); // TRUE 

//     if (esMongoID) {
//         const producto = await Producto.findById(termino)
//             .populate('categoria', 'nombre');
//         return res.json({
//             results: (producto) ? [producto] : []
//         });
//     }

//     const regex = new RegExp(termino, 'i');
//     const productos = await Producto.find({ nombre: regex, estado: true })
//         .populate('categoria', 'nombre')

//     res.json({
//         results: productos
//     });

// }


const venderProducto = async (req, res = response) => {

    const { id } = req.params;

    const esMongoID = ObjectId.isValid(id); // TRUE 

    if (!esMongoID) {
        return res.status(400).json('El producto no es válido');
    }

    const producto = await Producto.findById(id);
    let stock = producto.cantidad;

    if (stock === 0) {
        return res.status(400).json('El producto no está en stock');
    }

    // Rebajando el stock
    const productoVendido = await Producto.findByIdAndUpdate(id, { cantidad: (stock - 1) }, { new: true });

    // Comprobando si ya existe en Vendido
    const vendidoDB = await Vendido.findOne({ producto: id });

    if (!vendidoDB) {

        // Generar la data a guardar
        const data = {
            producto: productoVendido.id,
            cantidad: 1
        }

        const nuevoVendido = new Vendido(data);

        // Guardar DB
        await nuevoVendido.save();
    } else {
        await Vendido.findByIdAndUpdate(vendidoDB.id, { ventas: (vendidoDB.ventas + 1) }, { new: true });
    }

    res.json({
        msg: 'Producto vendido'
    });

}


const buscarVendidos = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const productos = await Vendido.find({ ventas: { $gt: 0 } })
        .populate('producto', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        vendidos: productos
    });

}


const buscarGananciaVendidos = async (req, res = response) => {

    let ganancia = 0;
    const productos = await Vendido.find({ ventas: { $gt: 0 } })
        .populate('producto', 'precio');

    productos.forEach(producto => {
        let ventas = producto.ventas;
        let precio = producto.producto.precio;
        let gananciaPorProducto = 0
        if (ventas !== 0 && precio !== 0) {
            gananciaPorProducto = ventas * precio;
        }
        ganancia += gananciaPorProducto;
    });

    res.json({
        Ganancia: `$ ${ganancia}`
    });

}


const ventas = (req, res = response) => {

    const { coleccion } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'vendidos':
            buscarVendidos(req, res);
            break;
        case 'ganancia':
            buscarGananciaVendidos(req, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    ventas,
    venderProducto
}