const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, esAdminRole } = require('../middlewares');
const { ventas, venderProducto } = require('../controllers/ventas');
const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

// Mostrar Vendidos y Ganancia Total - privado
router.get('/:coleccion', [
    validarJWT
], ventas);

// Vender producto - privado
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId)
], venderProducto);

module.exports = router;