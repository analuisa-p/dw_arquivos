const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('Cookies recebidos: ', req.cookies);
    
    try{
        //Tenta verificar se o token é valido, usando o nosso segredo
        const decoded = jwt.veufy(token, process.env.JWT_SECRET);

        //Se for válido, adiciona o 'payload' do token na requisição para ser usado depois
        req.user = decoded;

        //Chama a próxima função/middleware na cadeia
        next();
    } catch (err) {
        //Se o token for inválido, a resposta é negada com o código 402 (Forbidden)
        res.status(403).send('Token inválido,');
    }
};
module.exports = verifyToken;