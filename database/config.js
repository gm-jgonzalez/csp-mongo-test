const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error at BD iniciatilizacion');
    }
}

module.exports = {
    dbConnection
}