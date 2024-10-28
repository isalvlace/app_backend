const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const authSecret = process.env.AUTH_SECRET;

async function validateCredentials(db, email, password) {
    const user = await db('user').where({ email }).first();
    if (!user) throw new Error('Usuário não encontrado!');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email/Senha inválidos!');
    
    return user;
}

function generateToken(user) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        id: user.id,
        name: user.username,
        email: user.email,
        admin: user.is_admin,
        iat: now,
        exp: now + (60 * 60 * 24 * 1) // 1 dia
    };
    return jwt.encode(payload, authSecret);
}

function isTokenValid(token) {
    try {
        const decodedToken = jwt.decode(token, authSecret);
        return new Date(decodedToken.exp * 1000) > new Date() && decodedToken.iat < Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

module.exports = app => {
    const signin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).send('Informe email e senha!');

            const user = await validateCredentials(app.db, email, password);
            const token = generateToken(user);

            res.json({ ...user, token });
        } catch (error) {
            res.status(error.message === 'Usuário não encontrado!' ? 400 : 401).send(error.message);
        }
    };

    const validateToken = (req, res) => {
        const { token } = req.body || {};
        const isValid = token ? isTokenValid(token) : false;
        res.send(isValid);
    };

    return { signin, validateToken };
};
