const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const { body, validationResult } = require('express-validator');

//----------------------------------------------------------------
// ROTA DE REGISTRO (POST /register) - INSERINDO DADOS NO POSTGRES
//----------------------------------------------------------------

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('O e-mail fornecido não é válido'),
        body('password').isLength({ min : 6}).withMessage('A senha deve ter no mínimo 6 caracteres')
    ],
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array() });
        }
    const {email, password } = req.body;

    try {
        // 1. Criptografa a senha antes de salvar (boas práticas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // 2. Executa a query de INSERÇÃO no POSTGRES
        // O uso de '?' previne ataques de SQL Injection
        await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2)',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        //Trata o erro de email duplicado (unique_violation do POSTGRES)
        if (error.code === 'unique_violation') {
            return res.status(400).json({ message: 'Erro no servidor.' });
        }
    }
});

//---------------------------------------------------------
//ROTA DE LOGIN (POST /login) - VALIDANDO DADOS NO POSTGRES
//---------------------------------------------------------

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //1. Executa a query de SELEÇÃO para buscar o usuário no POSTGRES
        //O resultado da query vem em um array,a primeira posição ([0]) são as linhas
        const [rows] = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user) {
            //Se o POSTGRES não retornou linhas, o usuário não existe
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // 2. Compara a senha digitada com o hash do POSTGRES
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // 3. Gera o JWT (não muda, pois o login foi validado)
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:3600000
        });

        res.status(200).json({message : 'Login bem sucedido.Token enviado via Cookie.'})
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.'});
    }
});

module.exports = router;