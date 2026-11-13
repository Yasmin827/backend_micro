const express = require('express');
const Tecnologia = require('../models/Tecnologia');
const verificarToken = require('../middlewares/auth');

const router = express.Router();

// Todas as rotas deste arquivo exigem token JWT.
router.use(verificarToken);

// READ: listar todas as tecnologias.
router.get('/', async (req, res) => {
    try {
        const tecnologias = await Tecnologia.find().sort({ nome: 1 });
        return res.status(200).json(tecnologias);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao listar tecnologias.' });
    }
});

// READ: consultar uma tecnologia pelo ID.
router.get('/:id', async (req, res) => {
    try {
        const tecnologia = await Tecnologia.findById(req.params.id);

        if (!tecnologia) {
            return res.status(404).json({ mensagem: 'Tecnologia nao encontrada.' });
        }

        return res.status(200).json(tecnologia);
    } catch (error) {
        return res.status(400).json({ mensagem: 'ID de tecnologia invalido.' });
    }
});

// CREATE: cadastrar uma tecnologia.
router.post('/', async (req, res) => {
    try {
        const { nome, base, curvaAprendizado } = req.body;

        if (!nome || !base || !curvaAprendizado) {
            return res.status(400).json({
                mensagem: 'Preencha nome, base e curva de aprendizado.'
            });
        }

        const tecnologia = await Tecnologia.create({
            nome,
            base: String(base).toUpperCase(),
            curvaAprendizado
        });

        return res.status(201).json({
            mensagem: 'Tecnologia cadastrada com sucesso.',
            tecnologia
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensagem: Object.values(error.errors).map(item => item.message).join(' ')
            });
        }
        return res.status(500).json({ mensagem: 'Erro ao cadastrar tecnologia.' });
    }
});

// UPDATE: atualizar uma tecnologia pelo ID.
router.put('/:id', async (req, res) => {
    try {
        const { nome, base, curvaAprendizado } = req.body;

        if (!nome || !base || !curvaAprendizado) {
            return res.status(400).json({
                mensagem: 'Preencha nome, base e curva de aprendizado.'
            });
        }

        const tecnologia = await Tecnologia.findByIdAndUpdate(
            req.params.id,
            {
                nome,
                base: String(base).toUpperCase(),
                curvaAprendizado
            },
            { new: true, runValidators: true }
        );

        if (!tecnologia) {
            return res.status(404).json({ mensagem: 'Tecnologia nao encontrada.' });
        }

        return res.status(200).json({
            mensagem: 'Tecnologia atualizada com sucesso.',
            tecnologia
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensagem: Object.values(error.errors).map(item => item.message).join(' ')
            });
        }
        return res.status(400).json({ mensagem: 'Nao foi possivel atualizar. Verifique o ID e os dados.' });
    }
});

// DELETE: excluir uma tecnologia pelo ID.
router.delete('/:id', async (req, res) => {
    try {
        const tecnologia = await Tecnologia.findByIdAndDelete(req.params.id);

        if (!tecnologia) {
            return res.status(404).json({ mensagem: 'Tecnologia nao encontrada.' });
        }

        return res.status(200).json({ mensagem: 'Tecnologia excluida com sucesso.' });
    } catch (error) {
        return res.status(400).json({ mensagem: 'ID de tecnologia invalido.' });
    }
});

module.exports = router;
