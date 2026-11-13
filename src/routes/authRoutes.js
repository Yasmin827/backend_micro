const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Login administrativo definido no arquivo .env.
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Informe o email e a senha.'
            });
        }

        const emailCorreto = process.env.ADMIN_EMAIL;
        const senhaConfigurada = process.env.ADMIN_PASSWORD;

        if (!emailCorreto || !senhaConfigurada || !process.env.JWT_SECRET) {
            return res.status(500).json({
                mensagem: 'Configure ADMIN_EMAIL, ADMIN_PASSWORD e JWT_SECRET no arquivo .env.'
            });
        }

        // Permite armazenar a senha em texto no .env para facilitar a configuracao local.
        // Se ADMIN_PASSWORD estiver no formato de hash bcrypt, tambem sera validada.
        let senhaValida = false;
        if (senhaConfigurada.startsWith('$2')) {
            senhaValida = await bcrypt.compare(senha, senhaConfigurada);
        } else {
            senhaValida = senha === senhaConfigurada;
        }

        if (email !== emailCorreto || !senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const token = jwt.sign(
            { email: emailCorreto },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso.',
            token
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao realizar login.' });
    }
});

module.exports = router;
