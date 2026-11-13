require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const tecnologiaRoutes = require('./routes/tecnologiaRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibiliza o frontend.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API.
app.use('/api/auth', authRoutes);
app.use('/api/tecnologias', tecnologiaRoutes);

app.get('/api', (req, res) => {
    res.status(200).json({
        mensagem: 'API de Cadastro de Tecnologias funcionando.',
        rotas: {
            login: 'POST /api/auth/login',
            tecnologias: '/api/tecnologias (token JWT obrigatorio)'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

async function startServer() {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Nao foi possivel iniciar a aplicacao:', error.message);
        process.exit(1);
    }
}

startServer();
