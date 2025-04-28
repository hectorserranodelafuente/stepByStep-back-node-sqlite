const utils = require('./utilsAuth.js')
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')
const Email = require('./emailSMS.js')
const { createHmac } = require('node:crypto')
const nodemailer = require('nodemailer')

class Login extends Auth{

    constructor(processArgv){
        
        super(processArgv)
        this.email = new Email(processArgv)
        this.utils = new utils(processArgv)
        
    }

   

    login(req,res){

        let sequence = new Promise((resolve,reject) => {
            
            this.db.serialize(() => {
              let index = 0
              // 0 false 1 true
              this.db.each(`SELECT email, addition FROM users WHERE (email = ?)`, [req.body.email], (err, row) => {
                
                if (err) {
                  console.error(err.message)
                  reject()
                }
                
                if(row.email) {
                  if(index==0) {
                    resolve(row)
                    index++
                  }  
                }
      
              },(err)=> reject());
            
            });
          })
          .then(response => {
            
           
            let _password = createHmac('sha256',response['addition']).update(req.body.password).digest('hex');
           
            return new Promise((resolve,reject) => {
              this.db.serialize(() => {
                let index = 0
                // 0 false 1 true
                this.db.each(`SELECT email,twoFA FROM users WHERE (email =?) AND (password=?)`, [req.body.email,_password], (err, row) => {
                  if (err) {
                    
                    reject()
                  }
                  console.log(row)
                  if(row.email) {
                    if(index==0) {
                      
                      resolve(row)
                      index++
                    }  
                  }
                
                },(err=>reject()))
              })  
            })
      
            
                  //...
          }).then( response =>{
            
            return new Promise((resolve,reject) => {
                this.db.serialize(() => {
                  let index = 0
                  // 0 false 1 true
                  this.db.each(`SELECT tokenSession, COUNT(*) FROM session WHERE email = ? AND finished != ? `, [req.body.email,1], (err, row) => {
                    if (err) {
                  
                      reject()
                    }
                  
                    if(row.email) {
                      if(index == (row['COUNT(*)']-1)) {
                        resolve({ twoFA: response.twoFA, tokenSession: row.token.session})
                        index++
                      }  
                    }
                  
                  },(err=>resolve({ twoFA: response.twoFA, tokenSession: null})))
                })  
              })
            
            }).then(response=>{
              
            if( response.twoFA == 0 && response.tokenSession){ 
        
                res.json({ action:0, status:'success', tsession:response.row.tokenSession, actionDescription:'Redirect to init' })
            }
            
            if( response.twoFA == 0 && !response.tokenSession ){
              
              let newToken = this.utils.generateToken(this.tokensLength)
              let email = req.body.email
              let startTiming = new Date().getTime() 
              let endTiming = new Date().getTime() + this.periodExpiring2FA
              let notRenewSession = 0

              let startTimingRenewal = endTiming
              let endTimingRenewal = startTimingRenewal + this.periodRenewalSession
              
              
              this.db.serialize(() => {
               
                try{
                const insertionSession = this.db.prepare(`INSERT INTO session VALUES (?,?,?,?,?,?,?,?)`)
                      insertionSession.run( newToken, email, startTiming, endTiming, notRenewSession, startTimingRenewal, endTimingRenewal,0)
                      insertionSession.finalize()
                }catch(err){
                  console.log(err)
                }
              })
             
              res.json({ action:0, tsession:newToken, description:'Redirect to init'})
            } 
      
            if(response.twoFA == 1 && response.tokenSession){
    
              res.json({ action:0, tsession:response.row.tokenSession, description:'Redirect to init' })
            }
      
            if(response.twoFA ==1 && !response.tokenSession){
            
              let intervalExpiredTiming = this.periodExpiring2FA
              let tokenTwoFASession = this.utils.generateToken(this.tokensLength)
              let code = this.utils.generateToken(this.code2FALength)
              let _try = 0
              let finished = 0
              let email = req.body.email
              let startTiming = new Date().getTime()
              let endTiming = new Date().getTime()+intervalExpiredTiming
              let confirmed = 0 
              let finishReason = ""
              try{
              
                this.db.serialize(() => {
                
                  const insertionTwoFA= this.db.prepare(`INSERT INTO twoFA VALUES (?,?,?,?,?,?,?,?,?)`)
                  
                  insertionTwoFA.run(
                    tokenTwoFASession, 
                    code,
                    _try, 
                    finished, 
                    email, 
                    startTiming, 
                    endTiming, 
                    confirmed,
                    finishReason)
                 
                
                  
                  insertionTwoFA.finalize()

                 
              })
              
            }catch(err){
              console.log(err)
            }
              
              let scope = this
              scope.email.sendEmailConfirmation2FA(req,res,code,tokenTwoFASession)
            
            } 
          }).catch( error => {
            res.json({action:2, status:'error', description:'wrong user o password'})
          })
    
    
    
    
    
    }
}

module.exports = Login