const Auth = require('./auth.js')
const Email = require('./emailSMS.js')


class ChangePassword extends Auth {

constructor( processArgv ){

  super( processArgv ) 
  this.email = new Email( processArgv ) 

}

changePassword(req,res){  
      
      const  email  = req.body.email
      
      let sql = `SELECT * FROM users WHERE email=?`
      
      let sequence = new Promise((resolve,reject)=>{
        
        try{
          
          this.db.serialize(()=>{
            
            this.db.each(sql, [ email ], (err,row)=>{ 
              
              if( row ){
                if( row.email ){ 
                  resolve()  
                }
              }

            },(err)=>reject())  
            
          })

        }catch(err){  
          
          reject(err)  
        
        }
      
      })

      sequence.then( (response,index) => {
        
        this.email.sendEmailChangePassword( req, res)

      }).catch(err => {
        
        
        return res.json({ 
          action: 2, 
          status: 'error', 
          description: 'something went wrong' 
        })

      })

}

}

module.exports = ChangePassword