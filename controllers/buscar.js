const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'productos',
    'totalbusqueda',
    'sinstock'
];

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

const buscarProductos = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const productos = await Producto.find(await queryBusqueda(req, res))
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        results: productos
    });

}

const totalBusquedaProductos = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const productos = await Producto.countDocuments(await queryBusqueda(req, res));

    res.json({
        total: productos
    });

}

const productosSinStock = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const productos = await Producto.find({ cantidad: 0, estado: true })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        results: productos
    });

}

const buscar = (req, res = response) => {

    const { coleccion } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'productos':
            buscarProductos(req, res);
            break;
        case 'totalbusqueda':
            totalBusquedaProductos(req, res);
            break;
        case 'sinstock':
            productosSinStock(req, res);
            break;

        default:
            res.status(500).json({
                msg: 'Error en el servidor. Búsqueda no implementada'
            })
    }

}

module.exports = {
    buscar
}