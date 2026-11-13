const mongoose = require('mongoose');

const tecnologiaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome da tecnologia e obrigatorio.'],
        trim: true,
        minlength: [2, 'O nome deve ter pelo menos 2 caracteres.'],
        maxlength: [80, 'O nome pode ter no maximo 80 caracteres.']
    },
    base: {
        type: String,
        required: [true, 'A base da tecnologia e obrigatoria.'],
        enum: {
            values: ['PHP', 'C#', 'JS'],
            message: 'A base deve ser PHP, C# ou JS.'
        }
    },
    curvaAprendizado: {
        type: String,
        required: [true, 'A curva de aprendizado e obrigatoria.'],
        trim: true,
        minlength: [2, 'Informe um tempo valido.'],
        maxlength: [60, 'A curva de aprendizado pode ter no maximo 60 caracteres.']
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Tecnologia', tecnologiaSchema);
