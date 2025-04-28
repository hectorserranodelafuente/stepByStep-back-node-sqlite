

const ChangePasswordNext = require('../../../modules/api/changePasswordNext.js')
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')


class forgotPasswordNext1{
    
    constructor(index, end, callback, socket){  
        
        this.case = new Case(index,end,callback,socket)
        this.callback = callback

    }

    main(processArgv,socket){

        let req = {
            
            body:{

                tokenChangePasswordSession:'WRONG TOKEN',  
                password:'whateverPassword',
                twoFA:0

            }

        }   
    
        let scope = this

        let res = new Emulate(
            'case 20',
            `Through second changePassword step,`+
            `DOESNT happen a change of user data \n`,
            'jsonContains', 
            {
                
                action:2,
                status:'error',
                description:'It was not possible to update'
            
            },
            scope.case.resolves[ scope.case.index ],
            socket,
            19)
            
        new ChangePasswordNext(processArgv).changePasswordNext(req,res)    
    
    
    }
}

module.exports = forgotPasswordNext1