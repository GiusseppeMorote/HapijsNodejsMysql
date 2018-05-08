'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const mysql = require('mysql');

//creo la conexion a mysql
const conexionMysql = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "mysql",
    database: "demo_user"
});




// creamos el servidor con el host y el puerto
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});


const swaggerOptions = {
    info: {
        title: 'Demo API Documentation',
        version: '1.0.0',
    },
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': swaggerOptions
    }], (err) => {
        if (err) {
            console.error('Failed to load plugin:', err);
        }
    });

// Add the route
server.route({
    method: 'POST',
    path: '/demo/useradd',
    config: {
        handler: function (request, reply) {
            console.log(request.payload);
            //declaro mis campos de la bd
            let username = request.payload.username;
            let email = request.payload.email;
            let age = request.payload.age;
            console.log(username);
            console.log(email);
            console.log(age);
            //valido la conexion
            conexionMysql.connect(function (err) {
                if (err) throw err;
                console.log("Mysql Connectedaaaaaaaaaaaaaaaaaaaaaaaa to demo_user!");
                // let sql = `INSERT INTO userdata (username,email,age) VALUES ('${username}', ${email},${age})` ;
                "INSERT INTO userdata (id,username,email,age) VALUES ('','" + username + "','" + email + "','" + age + "')";
                conexionMysql.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted ==> filasAfectadas");
                });
            });

            reply({ success: true, message: 'usuario agregado correctamente' });
        },
        description: 'Post user data',
        notes: 'Demo obtiene la peticion',
        tags: ['api'],
        validate: {
            params: {
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                age: Joi.number().min(18)
            }
        }
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();