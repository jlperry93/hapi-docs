var Hapi = require('hapi'),
    CardStore = require('./lib/cardStore'),
    UserStore = require('./lib/userStore');

var server = new Hapi.Server();

CardStore.initialize();

server.connection({ port:3000});

server.views({
    engines: {
        html: require('handlebars')
    },
    path: './templates'
});
//Server Connection Method
//var mainServer  = server.connection({
//    port: 8000,
//    cache : {
//        statuses: [200, 404],
//    },
//    //labels are helpful when setting up multiple connections
//    labels: ‘main'
//});

//Server Extension Method
//server.ext(‘onPreResponse’, function (request, reply){
//    console.log(‘Responding’);
//    console.log(‘Response: ‘ + request.response);
//});

//can use good to monitor and log instead
//server.ext('onRequest', function (request, reply) {
//    console.log('Request received: ' + request.path);
//    reply.continue();
//});

server.register({
    register: require('good'),
    options : {
        opsInterval: 5000,
        reporters: [
            {
                reporter : require('good-file'),
                events: { ops: '*'},
                config: {
                    path: './logs',
                    prefix: 'hapi-process',
                    rotate: 'daily'
                }
            }, {
                reporter : require('good-file'),
                events: { response: '*'},
                config: {
                    path: './logs',
                    prefix: 'hapi-requests',
                    rotate: 'daily'
                }
            },{
                reporter : require('good-file'),
                events: { error: '*'},
                config: {
                    path: './logs',
                    prefix: 'hapi-error',
                    rotate: 'daily'
                }
            }
        ]
    }
}, function (err){
    console.log(err);
});

server.register(require('hapi-auth-cookie'), function(err) {
    if(err) console.log(err);

    server.auth.strategy('default', 'cookie', {
        password : 'myPassword',
        redirectTo: '/login',
        isSecure: false
    });
    server.auth.default('default');
});

server.ext('onPreResponse', function (request, reply){
    if(request.response.isBoom){
        return reply.view('error', request.response);
    }
    reply.continue();
});

server.route(require('./lib/routes'));


//server.route({
//    path: '/hello',
//    method: 'GET',
//    handler: function (request, reply){
//        //request has all the information about the request, like client, cookies, request parameters
//        //reply the message route gets back
//        reply('Hello World');
//    }
//});

server.start(function () {
    console.log('Listening on ' + server.info.uri);
});