const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')
const Confirm2FA  = require('../../../modules/api/confirm2FA.js')

class LoginCase7 {

    constructor( index, end, callback, socket ){

        this.case = new Case( index, end, callback, socket)
        this.callback = callback

    }
    
   
    auxFunction(processArgv,email){
        
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
                email:'prueba-2@mailinator.com', 
                 password:'contrasena@2025' 
            }
        }

        let scope = this
        this.auxFunction( processArgv, auxRequest.body.email ).then((response) => {
            
            let req = {
                body:{  
                    tokenTwoFASession:response.tokenTwoFASession,
                    code:'WRONGCODE'
                }
            }

            let res = new Emulate(`case 13`,`Exceed the number of tryes to confirm 2FA`,
                'jsonContains',{ 
                    action:3, 
                    error: 'Something went wrong',
                    description: 'Have being exceed the number of tryes'
                },
                scope.case.resolves[scope.case.index],
                socket,
                12)

            
            new Confirm2FA(processArgv).confirm2FA(req,res)
            
        
        })
        return this.case.promise
    }
    
    
}

module.exports = LoginCase7

