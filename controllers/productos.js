const { response } = require('express');
const { Producto } = require('../models');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

const obtenerProductos = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);

}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;
    let imagen = '';

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    if (req.files && req.files.imagen) {
        img = req.files.imagen

        try {

            // Insertando Imagen en Cloudinary
            const nombreCortado = img.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];

            // Validar la extension
            if (extensionesValidas.includes(extension)) {
                const { tempFilePath } = img;

                //Insertar en cloudinary
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
                imagen = secure_url;
            }

        } catch (msg) {
            res.status(400).json({ msg });
        }
    }

    // Generando la data a guardar en BD
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        img: imagen
    }

    const producto = new Producto(data);

    //Guardar en BD
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (req.files && req.files.imagen) {
        img = req.files.imagen

        try {

            // Actualizando Imagen en Cloudinary
            const nombreCortado = img.name.split('.');
            const extension = nombreCortado[nombreCortado.length - 1];

            // Validar la extension
            if (extensionesValidas.includes(extension)) {
                const { tempFilePath } = img;

                //Insertar en cloudinary
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
                data.img = secure_url;
            }

        } catch (msg) {
            res.status(400).json({ msg });
        }
    }

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    //Actualizar en BD
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);

}

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}