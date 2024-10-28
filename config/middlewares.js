const bodyParser = require('body-parser');
const cors = require('cors');

function configureMiddleware(app) {
    app.use(bodyParser.json());

    const corsOptions = {
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    };
    app.use(cors(corsOptions));
}

module.exports = configureMiddleware;