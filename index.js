'use strict';
//declaro lo que voy autilizar
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Relish = require('relish')({});
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const mysql = require('mysql');

//creo la conexion a mysql
const conexionMysql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "demo_user"
});

// indico si hay conexion!
 conexionMysql.connect(function (err) {
     if (err) throw err;
     console.log("Mysql Connected to demo_user!");
 });


// creamos el servidor con el host y el puerto
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000,
    // for cross-origin
    routes: {
        cors: true
    }
});

//declaro la info para swagger
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
server.route([{
    method: 'POST',
    path: '/demo/useradd',
    config: {
        handler: function (request, reply) {
            //muestra en consola los datos que son ingresado
            console.log(request.payload);
            //almaceno los datos ingresado en variables para ingresar ala bd
            let username = request.payload.username;
            let email = request.payload.email;
            let age = request.payload.age;
            //pregunto si hay conexion a mysql e inserto en la tabla
            conexionMysql.connect(function (err) {
                 let sql = `INSERT INTO userdata (username,email,age) VALUES ('${username}', '${email}',${age})` ;
                conexionMysql.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted ==> filasAfectadas");
                });
            });
            //muestro un mensaje de exito en caso la peticion ha sido correcta
            reply({ success: true, message: 'usuario agregado correctamente' });
        },
        description: 'Post user data',
        notes: 'Demo obtiene la peticion',
        tags: ['api'],
        validate: {
            payload: {
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                age: Joi.number().min(18)
            }
        }
    }
},{
    method: 'GET',
    path: '/demo/getuser/{id}',
    config: {
        handler: function (request, reply) {
            //muestra en consola los datos que son ingresado
            console.log(request.params);
            //almaceno el id
            let id = request.params.id;          
            //pregunto si hay conexion a mysql e busco en la tabla
            conexionMysql.connect(function (err) {
                 let sql = `SELECT username,email,age FROM userdata  WHERE = ' ${id} '` ;
                conexionMysql.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("mostramos al usuario => " + id);
                    reply(result);
                });
            });
            //muestro un mensaje de exito en caso la peticion ha sido correcta
            
        },
        description: 'Post user data',
        notes: 'Demo obtiene la peticion get',
        tags: ['api'],
        validate: {
            failAction: Relish.failAction,
            params: {
                id: Joi.number().required()
            }
        }
    }
}]
    
);


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