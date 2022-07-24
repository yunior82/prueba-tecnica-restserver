const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

/*
** Mostrar Productos sin stock
** Busqueda general de productos por caracteristicas
** Total de busqueda por caracteristicas
** privado
*/
router.get('/:coleccion', buscar)

module.exports = router;