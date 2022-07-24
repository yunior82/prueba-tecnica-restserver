const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe en BD
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Correo no existe en la BD'
            });
        }

        // SI el usuario está activo en BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario no activo en el sistema'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password no correcto'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error en el sistema, por favor consulte al administrador.'
        });
    }

}

module.exports = {
    login
}
