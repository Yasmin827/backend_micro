const mongoose = require('mongoose');

async function connectDatabase() {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error('A variavel MONGO_URL nao foi definida no arquivo .env.');
    }

    await mongoose.connect(mongoUrl);
    console.log('Conectado ao MongoDB Atlas.');
}

module.exports = connectDatabase;
