

const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const { subirArchivo, subirArchivoCloudinary } = require('./subir-archivo');


module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    subirArchivo,
    subirArchivoCloudinary
}