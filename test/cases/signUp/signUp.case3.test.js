
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const SignUp = require('../../../modules/api/signUp.js')
const ConfirmSignUp = require('../../../modules/api/confirmSignUp.js')
const Auth = require('../../../modules/api/auth.js')
const { reset } = require('../../resetDbTest.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { test } = require('../../../env.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')

    class SignUpCase3{
        
        constructor(index,end,callback){   
            this.case = new Case(index,end,callback)
        }   


    auxGetConfirmationToken(email,processArgv){
        return new Promise((resolve,reject)=>{
        let token
            new Auth(processArgv).db.serialize(()=>{
                let index = 0
                new Auth(processArgv).db.each(`SELECT tokenPreUsers,COUNT(*) FROM preUsers WHERE email="${email}" AND confirmed=0`,(err,row)=>{
                    if(err){ console.log('-----',err) }
                    if(index==(row['COUNT(*)']-1)){   
                        token = row.tokenPreUsers
                        resolve(token)
                    }
                    index++
                },(err)=>{if(err){console.log('err----'+err)}})
            })
        })
    }
    
    main(processArgv,socket){
        

        let scope = this
        this.auxGetConfirmationToken( 'prueba-1@mailinator.com', processArgv ).then(response=>{
            
            let req3 = { query:{ ts:null }  }
    
            let res3 = new Emulate('case 3','We confirm first user signUp successfully','html','has being successfull signedUp', scope.case.resolves[scope.case.index], socket,2)

            req3.query.ts=response
    
            let confirmSignUp3= new ConfirmSignUp(processArgv)
           
    
            confirmSignUp3.confirmSignUp(req3,res3)

        })

        return this.case.promise
    }
}

    
module.exports = SignUpCase3