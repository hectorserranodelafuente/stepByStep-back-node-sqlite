
const Auth = require('./auth.js')

class CloseSession extends Auth{
    
    constructor(processArgv){   
        
        super(processArgv)  
        
    }

    closeSession( req, res){
        
        let sequence = new Promise((resolve,reject)=>{
    
    
            this.db.serialize(() => {
              let index = 0
              
              this.db.each(`SELECT * FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.token,0], (err, row) => {
                
                if (err) {
                  reject(err)
                }
               
                if(row.email) {
                  if(index==0) {
                    resolve({ closed: false })
                    index++
                  }  
                }
              
              },(err => reject({ closed: true })))
      
            })      
        
        }).then( response => {

          return new Promise((resolve,reject) => {

            if(response){
      
              this.db.serialize( () => {
      
                const   updateSessionUser = this.db.prepare(`UPDATE session SET finished = ? WHERE  tokenSession = ?`)
                        updateSessionUser.run(1, req.body.token)
                        updateSessionUser.finalize()
            
              })

              resolve({closed:true})
      
            }
          })
          
        }).then((response)=>{
          
          if(response.closed==true){
            res.json({ action:0, description:'The session was closed successfully' })
          }
      
        }).catch( err=>{
          
          
          if(err.closed){
            res.json({action:1,description:'The session not exist or was closed before'})
          }else{
            res.json({action:2,description:'There was some problem closing session'})
          }
      
        
        })


    }


}

module.exports = CloseSession