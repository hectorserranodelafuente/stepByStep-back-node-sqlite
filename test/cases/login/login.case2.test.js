
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')

class LoginCase2 {

    constructor(index,end,callback,socket){

        this.case = new Case(index,end,callback,socket)
        this.callback = callback

    }
    
    main(processArgv,socket){
        
        let req5 = {    
            body:{  
                email:'prueba-1@mailinator.com', 
                password:'contrasena@2025' 
            }
        }
        
        let scope = this

        function mockEmail(req,res){
            res.json({
                action:1,
                status:'ok',
                description:'Confirmation email sent, check your email'
            })
        }
        
        let res5 = new Emulate(
            `case 8`,`We login with a user that has being signed up, doesnt have session initialized yet and has 2FA activated, it is sent a confirmation email`,
            'json',
            {
                action:1,
                status:'ok',
                description:'Confirmation email sent, check your email'
            },
            scope.case.resolves[scope.case.index],
            socket,
            7)
        
        
        let login5 =  new Login(processArgv)
        
        login5.email.sendEmail = mockEmail

        login5.login(req5,res5)

        return this.case.promise
    
    }
    
    
}

module.exports = LoginCase2
