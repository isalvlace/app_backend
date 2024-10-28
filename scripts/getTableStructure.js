const knexConfig = require('../knexfile'); 
const knex = require('knex')(knexConfig);
const Table = require('cli-table3');

async function getTableStructure(tableName) {
  try {
    const chalk = (await import('chalk')).default;
    const schema = await knex.raw(`DESCRIBE ${tableName}`);

    // Configurar a tabela
    const table = new Table({
      head: [
        chalk.cyan('Field'),
        chalk.cyan('Type'),
        chalk.cyan('Null'),
        chalk.cyan('Key'),
        chalk.cyan('Default'),
        chalk.cyan('Extra')
      ],
      colWidths: [20, 30, 10, 10, 20, 20]
    });

    schema[0].forEach(column => {
      table.push([
        column.Field,
        column.Type,
        column.Null,
        column.Key,
        column.Default === null ? 'NULL' : column.Default,
        column.Extra
      ]);
    });

    console.log(table.toString());
  } catch (error) {
    console.error('Erro ao obter a estrutura da tabela:', error);
  } finally {
    await knex.destroy();
  }
}

getTableStructure('user');