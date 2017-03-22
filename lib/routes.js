var Handlers = require('./handlers');
//pre-fix handlers with the Handlers variable

var Routes = [{
        path: '/',
        method: 'GET',
        handler: {
            file: 'templates/index.html'
        },
        config: {
            auth: false
        }
    }, {
        //* matches any path
        path: '/assets/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
                listing: false
            }
        },
        config: {
            auth: false
        }
    },{
        path: '/cards/new',
        method: ['POST', 'GET'],
        handler: Handlers.newCardHandler
    }, {
        path: '/cards',
        method: 'GET',
        handler: Handlers.cardHandler
    }, {
        path: '/cards/{id}',
        method: 'DELETE',
        handler: Handlers.deleteCardHandler
    }, {
        path: '/login',
        method: 'GET',
        handler: {
            file: 'templates/login.html'
        },
        config: {
            auth: false
        }
    }
];

module.exports = Routes;