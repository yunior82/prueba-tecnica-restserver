const mongoose = require('mongoose');

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CON, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos conectada');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de conectar la base de datos');
    }

}

module.exports = {
    dbConnection
}
