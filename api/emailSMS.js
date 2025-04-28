logger = require('../logger/logger.js')
const UtilsAuth = require('./utilsAuth.js')
const Auth = require('./auth.js')
const nodemailer = require('nodemailer');
const sendSMSLabsMobile = require('../../node_modules/stepByStep-plugin-sms-labsMobile/main/smsLabsMobile.js')

class Email extends UtilsAuth{

    constructor(processArgv){
        super(processArgv)  
        this.processArgv = processArgv
    }

    async sendSMS(req,res,subject,text,add){
      new sendSMSLabsMobile(this.processArgv).sendSMSLabsMobile(req,res,subject,text,add)
    }

    async sendEmail(req,res,subject,text,add){

      //console.log('SENDMAIL')

      let scope=this
      let transporter = nodemailer.createTransport({
          host:scope.transporterHost, 
          port:scope.transporterPort,
          secure:scope.transporterSecure,
          auth: {
              user:scope.transporterAuthUser,
              pass:scope.transporterAuthPass, 
          },
          tls: {
              rejectUnauthorized:scope.transporterTlsRejectUnauthorized
          }
      });
      
      
      let mailOptions = {
          from: scope.mailOptionsFrom,
          to: req.body.email,
          subject: subject,
          text: text,
      };
      
      let sequence=new Promise((resolve,reject)=>{
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              logger.log( scope.dirPathLogger, scope.logsFileName, `Error on sending email: ${error}` )  
              logger.log( scope.dirPathLogger, scope.logsFileName, `User: ${req.body.email}` )
              return console.log(error);
            }
            
            console.log('Correo enviado: %s', info.messageId);
            
            let _serverResponse = {action:1,status:'ok',description:'Confirmation email sent, check your email'}
           
            if(add){
              
              _serverResponse={ ..._serverResponse,...add }
              
            }
           
            resolve(_serverResponse)
          
            
            
            end = true
          });
      }).then(response=>{
        
        res.json(response)

      })


    }

    

    async sendEmailConfirmationSignUp(req,res){
     
      let timeExpirationSession = this.periodExpiringPreUsers
      let tokenSessionPreUsers = this.generateToken(this.tokensLength)
      let urlConfirmSignUp = `${this.domainName}/api/confirmSignUp?ts=${tokenSessionPreUsers}`
      let encryptedPassword = this.encryptPassword(req.body.password,this.additionLength)
      let value2FA = req.body['twoFA']
      let valueStarTiming = new Date().getTime()
      let valueEndTiming = valueStarTiming+timeExpirationSession
      let valueConfirmed = 0
      let valueFinished = 0
      
      try{
       
       
          const insertionPreUser = this.db.prepare(`INSERT INTO preUsers VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
          insertionPreUser.run(req.body.email,tokenSessionPreUsers,req.body.urlName, encryptedPassword.encryptedPassword, value2FA, valueStarTiming.toString(), valueEndTiming.toString(), valueConfirmed,encryptedPassword.addition, valueFinished, req.body.typeTwoFA, req.body.phoneNumber)
          insertionPreUser.finalize()
       
       
      }catch(err){
        console.log(err)
      }
      
      let scope=this
      let subject = 'Confirmation SignUp Account'
      let text = `Click here to confirm. ${urlConfirmSignUp}`
      
      
      this.sendEmail(req,res,subject,text)

    }

    

    sendEmailConfirmation2FA(req,res,code,token2FA,number){

      let subject='Code 2FA authentication'
      let text = `That´s your confirmation authentication code: ${code}`
        
      
      let sequence = new Promise((resolve,reject)=>{

        this.db.serialize(()=>{
        
          let index = 0
          
          this.db.each(`SELECT typeTwoFA, phoneNumber from users WHERE email = ?`, [req.body.email], (err,row) => {
            
            if(row.typeTwoFA) {
              
              if(index==0) {
                
                resolve({ 
                  typeTwoFA:row.typeTwoFA,  
                  phoneNumber:row.phoneNumber 
                })
              
              }
            }
          
          },(err=>reject()))
        
        })
      
      }).then( response => {

        switch(response.typeTwoFA){
          case 'email':
            this.sendEmail(req,res,subject,text,{ t2FASession:token2FA })
          break;
          case 'sms':
            this.sendSMS(req,res,subject,text,{ t2FASession:token2FA, phoneNumber:response.phoneNumber })
          break;
        }
      
      })
    
    }
  

    sendEmailChangePassword( req, res){
      
      let domain, subject, text
      
      let timeExpirationSession = this.periodExpiringPreUsers
      let tokenSessionChangePassword = this.generateToken(this.tokensLength)
      let urlChangePassword = `${this.domainName}/view/change-password-step-two?ts=${ tokenSessionChangePassword }`
      
      let password = ''
      let addition = ''
      
      
      let value2FA = req.body['twoFA']
      let valueStarTiming = new Date().getTime()
      let valueEndTiming = valueStarTiming+timeExpirationSession
      let valueConfirmed = 0
      let valueFinished = 0
      let twoFA = 1
      
      let error = false
      
      try{
        
        const changePassword = this.db.prepare(`INSERT INTO changePassword VALUES (?,?,?,?,?,?,?,?,?)`)
          
              changePassword.run(
                tokenSessionChangePassword,
                req.body.email,
                valueStarTiming.toString(), 
                valueEndTiming.toString(), 
                password,
                valueConfirmed, 
                addition,
                valueFinished,
                twoFA
              )
              
              changePassword.finalize()
       
        
      }catch(err){
        error = true
      }

      if(!error){
        
        domain = this.domainName
        subject = 'That´s your URL link for changing password'
        text = `${urlChangePassword}` 
        
        this.sendEmail(req,res,subject,text)
      
      }
  }
}

module.exports = Email