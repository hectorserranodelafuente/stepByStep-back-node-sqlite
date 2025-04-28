const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const {exec}  = require( 'child_process' )
const path  = require('path')

var socket

const Accumulator = require('../node_modules/emulate/main/accumulator.js')


const signUpCase1 = require('./cases/signUp/signUp.case1.test.js')
const signUpCase2 = require('./cases/signUp/signUp.case2.test.js')
const signUpCase3 = require('./cases/signUp/signUp.case3.test.js')
const signUpCase4 = require('./cases/signUp/signUp.case4.test.js')
const signUpCase5 = require('./cases/signUp/signUp.case5.test.js')
const signUpCase6 = require('./cases/signUp/signUp.case6.test.js')
const signUpCase7 = require('./cases/signUp/signUp.case7.test.js')
const signUpCase8 = require('./cases/signUp/signUp.case8.test.js')

const loginCase1 = require('./cases/login/login.case1.test.js')
const loginCase2 = require('./cases/login/login.case2.test.js')
const loginCase3 = require('./cases/login/login.case3.test.js')
const loginCase4 = require('./cases/login/login.case4.test.js')
const loginCase5 = require('./cases/login/login.case5.test.js')
const loginCase6 = require('./cases/login/login.case6.test.js')
const loginCase7 = require('./cases/login/login.case7.test.js')

const loginCase8 = require('./cases/login/login.case8.test.js')
const loginCase9 = require('./cases/login/login.case9.test.js')

const forgotPassword = require('./cases/forgotPassword/forgotPassword.case1.test.js')
const forgotPassword2 = require('./cases/forgotPassword/forgotPassword.case2.test.js')

const forgotPasswordNext = require('./cases/forgotPassword/forgotPasswordNext.case1.test.js')
const forgotPasswordNext2 = require('./cases/forgotPassword/forgotPasswordNext.case2.test.js')

const loginCase10 = require('./cases/login/login.case10.test.js')

const encryptCase = require('./cases/encrypt/encrypt.case1.test.js')


function dist(){    
    console.log('DIST')     
}

let inst1, 
    inst2, 
    inst3, 
    inst4, 
    inst5, 
    inst6, 
    inst7, 
    inst8, 
    inst9, 
    inst10, 
    inst11, 
    inst12,
    inst13,
    inst14,
    inst15,
    inst16,
    inst17,
    inst18,
    inst19,
    inst20,
    inst21,
    inst22,
    inst23

let time = 3000

server.on('connection', (_socket) => {
    
    console.log('Cliente conectado',_socket);
    
    socket = _socket
    
    
    inst1 = new signUpCase1( 0, false, null)
    inst2 = new signUpCase2( 1, false, null)
    inst3 = new signUpCase3( 2, false, null)
    inst4 = new signUpCase4( 3, false, null)
    inst5 = new signUpCase5( 4, false, null)
    inst6 = new signUpCase6( 5, false, null)
    

    
    inst7 = new loginCase1( 6, false, null)
    inst8 = new loginCase2( 7, false, null)
    inst9 = new loginCase3( 8, false, null)
    inst10 = new loginCase4( 9, false, null)
    inst11 = new loginCase5( 10, false, null)
    inst12 = new loginCase6( 11, false, null)
    inst13 = new loginCase7( 12, false, null)


    inst14 = new signUpCase7( 13, false, null)
    inst15 = new signUpCase8( 14, false, null)
    inst16 = new loginCase8( 15, false, null)
    inst17 = new loginCase9( 16, false, null)

    inst18 = new forgotPassword( 17, false, null)
    inst19 = new forgotPassword2( 18, false, null)
    inst20 = new forgotPasswordNext( 19, false, null) 
    inst21 = new forgotPasswordNext2( 20, false, null)

    inst22 = new loginCase10( 21, true, dist, socket )
    //inst23 = new encryptCase(22, true, dist, socket)
    
    let instances = [ 
        inst1, 
        inst2, 
        inst3, 
        inst4, 
        inst5,
        inst6,
        inst7,
        inst8,
        inst9,
        inst10,
        inst11,
        inst12,
        inst13,
        inst14,
        inst15,
        inst16,
        inst17,
        inst18,
        inst19,
        inst20,
        inst21,
        inst22//,
        //inst23
    ]

        instances.forEach((inst,index) => {

            setTimeout(function(){
                inst.main(process.argv,socket)
            },time)
            
            time += 3000
        })
    
    
    socket.on('message', (message) => {
        console.log('Mensaje recibido: ', message);
        // Enviar respuesta al cliente
        socket.send('Mensaje recibido');
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});

let filePath=path.join(__dirname,'..','/node_modules/emulate/main/wsClient.html')
const command = `start chrome "${filePath}"`
exec(command,(err)=>{ console.log(err) });

console.log('Servidor WebSocket escuchando en el puerto 8080')