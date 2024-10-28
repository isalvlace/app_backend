require('dotenv').config();

const express = require('express');
const consign = require('consign');
const db = require('./config/db');

if (!process.env.PORT || !process.env.AUTH_SECRET) {
    console.error('⚠️  Erro: Variáveis de ambiente essenciais não carregadas.');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.db = db;

function loadModules() {
    consign({ verbose: false })
        .include('./config/passport.js')   
        .then('./config/middlewares.js')   
        .then('./controllers/ValidationController.js')  
        .then('./controllers/')            
        .then('./controllers/AuthController.js')       
        .then('./config/routes.js')        
        .into(app);
}

function startServer() {
    try {
        loadModules();
        app.listen(port, () => {
            console.log('\x1b[1;38;5;199m%s\x1b[0m', `😎 Servidor rodando na porta ${port}`);
        });
    } catch (error) {
        console.error('⚠️  Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();
