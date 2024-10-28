module.exports = (middleware) => {
    return (req, res, next) => {
        if (req.user && req.user.is_admin) {
            return middleware(req, res, next);
        } else {
            return res.status(401).json({ error: 'Usuário não é administrador.' });
        }
    };
};