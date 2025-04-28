
const Auth = require('../api/auth.js')
const logger = require('../logger/logger.js')
class CheckSession extends Auth{

    constructor(processArgv){
        super(processArgv)
    }

    checkSession(req,res){

        let finalResponse
        let queryTokenSession = true
        let responseSent=false



        if(!req.body.tokenSession){ 
            queryTokenSession = false  
        }
        
        
            
            if(!queryTokenSession){  
                finalResponse = { description:'not tokenSession provided'} 
                res.json(finalResponse)
                responseSent=true
             }else{
            
                
                
                
                
                
                this.db.serialize(()=>{
                    let index = 0
                this.db.each(`SELECT * FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.tokenSession,0], (err, row) => {
                    
                    if (err) {  
                        finalResponse = {error:err} 
                        
                        if(!response.sent){
                            res.json(finalResponse)
                        }  
                        responseSent=true   
                    }
                    
                    if(row.email) {
                       
                        if(index==0) {
                            
                            finalResponse = { closed: false }
                            
                            if(!responseSent){
                            res.json(finalResponse)
                            
                            responseSent=true  
                            }
                            index++
                        }  
                    }
                
                },(response => {

                        finalResponse = { closed: true, description:'not session found' }
                     
                        if(!responseSent){
                        res.json(finalResponse)
                        }

                    }))

                    
                   
            
                })
            
            }
               

    }
}

module.exports = CheckSession