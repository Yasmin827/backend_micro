const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao) {
        return res.status(401).json({
            mensagem: 'Token nao informado. Faca login para continuar.'
        });
    }

    const partes = autorizacao.split(' ');
    const esquema = partes[0];
    const token = partes[1];

    if (esquema !== 'Bearer' || !token) {
        return res.status(401).json({
            mensagem: 'Formato do token invalido. Use: Bearer SEU_TOKEN.'
        });
    }

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dados;
        next();
    } catch (error) {
        return res.status(401).json({
            mensagem: 'Token invalido ou expirado.'
        });
    }
}

module.exports = verificarToken;
