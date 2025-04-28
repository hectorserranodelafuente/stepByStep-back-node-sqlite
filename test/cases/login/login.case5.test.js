const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')
const Confirm2FA  = require('../../../modules/api/confirm2FA.js')

class LoginCase5 {

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

            let res = new Emulate(`case 11`,`We try to confirm the second user 2FA with the wrong code`,
                'jsonContains',{ 
                    action:2, 
                    error: 'Something went wrong',
                    description: 'try failed'},
                scope.case.resolves[scope.case.index],
                socket,
                10)

            
            new Confirm2FA(processArgv).confirm2FA(req,res)
        
        })

    }
    
    
}

module.exports = LoginCase5

