require('dotenv').config();

const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

function configureJwtStrategy(app, secretOrKey) {
    const params = {
        secretOrKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    return new Strategy(params, async (payload, done) => {
        try {
            const user = await app.db('user')
                .where({ id: payload.id })
                .first();
            if (user) {
                return done(null, { ...payload, is_admin: user.is_admin });
            }
            return done(null, false);
        } catch (err) {
            return done(err, false);
        }
    });
}

function initializePassport(app) {
    const secretOrKey = process.env.AUTH_SECRET;
    if (!secretOrKey) {
        throw new Error('AUTH_SECRET não está definido no ambiente');
    }

    const strategy = configureJwtStrategy(app, secretOrKey);
    passport.use(strategy);

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    };
}

module.exports = initializePassport;