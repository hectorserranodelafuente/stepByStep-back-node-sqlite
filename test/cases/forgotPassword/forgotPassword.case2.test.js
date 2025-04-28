
const ChangePassword = require('../../../modules/api/changePassword.js')
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')

class ForgotPassword2{

    constructor(index, end, callback, socket){  
        
        this.case = new Case( index, end, callback, socket)
        this.callback = callback

    }
    

    main(processArgv,socket){

        let req2 = {
            body:{ 
                email:'prueba-1@mailinator.com',
            }
        }
        
        function mockEmail(req,res){ 
            res.json({
                action: 2,
                status: 'ok',
                description: 'Confirmation email sent, check your email'
            })  
        }
        
        let scope = this
        
        let res2 = new Emulate(
                    'case 19',
                    'We introduce a user that is in our db so we receive an email\n',
                    'json',
                    { 
                        action:2,
                        status:'ok',
                        description:'Confirmation email sent, check your email'
                    },
                    scope.case.resolves[ scope.case.index ],
                    socket,
                    18)        
        
        let changePassword = new ChangePassword( processArgv )
        
        changePassword.email.sendEmail = mockEmail
        
        changePassword.changePassword( req2, res2)

        return this.case.promise            
    
    }
}

module.exports = ForgotPassword2