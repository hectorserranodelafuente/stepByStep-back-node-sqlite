const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const SignUp = require('../../../modules/api/signUp.js')
const ConfirmSignUp = require('../../../modules/api/confirmSignUp.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')

    class SignUpCase4{
        
    constructor(index,end,callback,socket){   
        this.case = new Case(index,end,callback,socket) 
    }   

    main(processArgv,socket){
        
        let req4 = {
            body:{
                urlName:'prueba2',
                password:'contrasena@2025',
                email:'prueba-1@mailinator.com',
                twoFA:1,
                typeTwoFA:'email',
                phoneNumber:1234
            }
        }
        
        let scope = this
        
        let res4 = new Emulate('case 4','We try to signUp with a user that has being Signed up before so we cant','json',{
            action:0,
            status:'error',
            description:`the user has being signUp before`
        }, scope.case.resolves[scope.case.index],socket,3)

        let signUp4 = new SignUp(processArgv)

        function mockEmail(req,res){
            res.json({
                action:1,
                status:'ok',
                description:'Confirmation email sent, check your email'
            })
        }

        signUp4.email.sendEmail = mockEmail

        signUp4.signUp( req4, res4)

        return this.case.promise
    }
}

    
module.exports = SignUpCase4