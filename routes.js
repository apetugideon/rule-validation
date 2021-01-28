const routeHandlers = require('./controller');

const routes = {
    post: {
        "validate-rule": routeHandlers.validateRule
    },
    get: {
        "": routeHandlers.index
    }
};

module.exports = routes;