const bcrypt = require('bcrypt-nodejs');
const UserModel = require('../models/UserModel');

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

async function validateAndSaveUser(user, app) {
    const { existsOrError, notExistsOrError, equalsOrError } = app.controllers.ValidationController;

    existsOrError(user.username, 'Nome não informado');
    existsOrError(user.email, 'E-mail não informado');
    existsOrError(user.password, 'Senha não informada');
    existsOrError(user.confirmPassword, 'Confirmação de Senha inválida');
    equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');

    const userFromDB = await UserModel.getUserByEmail(user.email);
    if (!user.id) {
        notExistsOrError(userFromDB, 'Usuário já cadastrado');
    }
}

module.exports = app => {
    const { existsOrError } = app.controllers.ValidationController;

    const save = async (req, res) => {
        const user = { ...req.body };
        if (req.params.id) user.id = req.params.id;

        if (!req.originalUrl.startsWith('/user') || !req.user?.is_admin) {
            user.is_admin = false;
        }

        try {
            await validateAndSaveUser(user, app);

            user.password = encryptPassword(user.password);
            delete user.confirmPassword;

            if (user.id) {
                await UserModel.updateUser(user);
            } else {
                await UserModel.createUser(user);
            }
            res.status(204).send();
        } catch (msg) {
            res.status(400).send(msg);
        }
    };

    const get = async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    const getById = async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await UserModel.softDeleteUser(req.params.id);
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.');

            res.status(204).send();
        } catch (msg) {
            res.status(400).send(msg);
        }
    };

    return { save, get, getById, remove };
};