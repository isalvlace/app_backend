const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);

async function runMigrations() {
    try {
        await knex.migrate.latest();
        console.log('Migrations are up to date.');
    } catch (err) {
        console.error('Error running migrations:', err);
    }
}

runMigrations();

module.exports = knex;