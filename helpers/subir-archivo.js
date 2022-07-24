const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    });

}

const subirArchivoCloudinary = async (archivo, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']) => {

    //return new Promise((resolve, reject) => {

    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
        return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
    }

    const { tempFilePath } = archivo

    try {
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        return secure_url;
        //resolve(secure_url);
    } catch (error) {
        //reject(error);
        throw error;
    }

    //});

}



module.exports = {
    subirArchivo,
    subirArchivoCloudinary
}