const admin = require('./admin');

function setupAuthRoutes(app) {
    app.post('/signup', app.controllers.UserController.save);
    app.post('/signin', app.controllers.AuthController.signin);
    app.post('/validateToken', app.controllers.AuthController.validateToken);
}

function setupUserRoutes(app) {
    const authenticate = app.config.passport.authenticate();
    
    app.route('/user')
        .all(authenticate)
        .post(admin(app.controllers.UserController.save))
        .get(admin(app.controllers.UserController.get));

    app.route('/user/:id')
        .all(authenticate)
        .put(admin(app.controllers.UserController.save))
        .get(admin(app.controllers.UserController.getById))
        .delete(admin(app.controllers.UserController.remove));
}

function configureRoutes(app) {
    setupAuthRoutes(app);
    setupUserRoutes(app);
}

module.exports = configureRoutes;
