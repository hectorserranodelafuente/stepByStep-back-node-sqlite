const Auth = require('./auth.js')
const utils = require('./utilsAuth.js')
class ChangePasswordNext extends Auth {

    constructor( processArgv ){  
        
        super(processArgv) 
        this.utils = new utils(processArgv)
    }
    
    changePasswordNext( req, res ){  
        
        const { 

            tokenChangePasswordSession, 
            password, 
            twoFA

        } = req.body

        let newPassword = this.utils.encryptPassword(password,this.additionLength) 
        
        let now = new Date().getTime()
        
        let sql = `SELECT *, COUNT(*) FROM changePassword WHERE startTiming <= ? AND endTiming >= ? AND finished = ? AND tokenChangePasswordSession = ?`
        
        let sequence = new Promise((resolve,reject) => {           

            this.db.serialize(()=>{

                this.db.each( sql, [ now, now, 0, tokenChangePasswordSession ], (err,row) => {

                    if( row.email ){  

                        resolve(row)   
                    
                    }

                },(err)=> {

                    reject() 
                
                })
            
            })

        }).then((response) => {
            
           
            let sql = `UPDATE users SET password = ?, twoFA = ?, addition = ? WHERE email = ?`
            let email = response.email
            
            return new Promise((resolve,reject) => {
                
                try{

                    this.db.run( sql, [ 
                        newPassword.encryptedPassword , 
                        twoFA, 
                        newPassword.addition,
                        email 
                    ])
                   
                
                }catch(err){
                    reject()
                }

                    resolve()
            })
        
        
        
        }).then((response)=>{
           
            
            let sql = `UPDATE changePassword SET  newPassword = ?, addition = ?, twoFA = ?, finished = ?, confirmed = ? WHERE tokenChangePasswordSession = ?`

            try{
                
                this.db.run( sql, [
                    newPassword.encryptedPassword, 
                    newPassword.addition, 
                    twoFA, 
                    1, 
                    1, 
                    tokenChangePasswordSession 
                ])

                //this.db.finalize()

            }catch(err){
                
                console.log(err)

            }
            
            
            return res.json({
                
                action:1,
                status:'success',
                description:'It was possible to change user data'

            })
        
        
        }).catch( (err) => {
            
            console.log(err)
            return res.json({
                
                action:2,
                status:'error',
                description:'It was not possible to update'
            
            })
            
        })

    }

}

module.exports = ChangePasswordNext