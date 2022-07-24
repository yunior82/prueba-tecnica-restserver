const { Router } = require('express');
const { buscar } = require('../controllers/buscar');
const { validarJWT } = require('../middlewares');

const router = Router();

/*
** Mostrar Productos sin stock
** Busqueda general de productos por caracteristicas
** Total de busqueda por caracteristicas
** privado
*/
router.get('/:coleccion', [
    validarJWT
], buscar)

module.exports = router;