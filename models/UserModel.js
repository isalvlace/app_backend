const db = require('../config/db');

class UserModel {
    static async getUserByEmail(email) {
        return db('user').where({ email }).first();
    }

    static async getAllUsers() {
        return db('user')
            .select('id', 'username', 'email', 'is_admin')
            .whereNull('deleted_at');
    }

    static async getUserById(id) {
        return db('user')
            .select('id', 'username', 'email', 'is_admin')
            .where({ id })
            .whereNull('deleted_at')
            .first();
    }

    static async createUser(user) {
        return db('user').insert(user);
    }

    static async updateUser(user) {
        return db('user')
            .update(user)
            .where({ id: user.id })
            .whereNull('deleted_at');
    }

    static async softDeleteUser(id) {
        return db('user')
            .update({ deleted_at: new Date() })
            .where({ id });
    }
}

module.exports = UserModel;