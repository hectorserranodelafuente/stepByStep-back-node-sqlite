
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
//const Login = require('../../../modules/api/login.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')
const Confirm2FA  = require('../../../modules/api/confirm2FA.js')

class LoginCase3 {

    constructor(index,end,callback,socket){

        this.case = new Case(index,end,callback,socket)
        this.callback = callback

    }

    auxFunction(processArgv,email){
        //console.log(email)
        return new Promise((resolve,reject)=>{
            new Auth(processArgv).db.serialize(()=>{
                let index = 0
                let sql=`SELECT tokenTwoFASession, code, COUNT(*) FROM twoFA WHERE email="${email}" AND finished = 0`
                console.log('sql',sql)
                new Auth(processArgv)
                    .db
                    .each(sql,
                    (err,row)=>{
                        
                        if( index == (row['COUNT(*)']-1)){
                            resolve({ tokenTwoFASession:row.tokenTwoFASession, code:row.code })
                        }
                        index++
                    },(err)=>resolve())
            })
        })

    }
    
    main(processArgv,socket){
        
        let auxRequest = {    
            body:{  
                email:'prueba-1@mailinator.com', 
                 password:'contrasena@2025' 
            }
        }

        let scope = this
        this.auxFunction( processArgv, auxRequest.body.email ).then((response) => {
            
            let req = {
                body:{  
                    tokenTwoFASession:response.tokenTwoFASession,
                    code:response.code
                }
            }

            let res = new Emulate(`case 9`,`We confirm 2FA with the right code, so we receive message to redirect to init`,
                'jsonContains',{ 
                    action:4, 
                    status:'success', 
                    description:'Redirect to init' },
                scope.case.resolves[scope.case.index],
                socket,
                8)

            
            new Confirm2FA(processArgv).confirm2FA(req,res)
        
        })

    }
    
    
}

module.exports = LoginCase3
