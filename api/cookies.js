
const Auth = require('./auth.js')
const logger = require('../logger/logger.js')

class Cookies extends Auth{

    constructor(processArgv){   
        super(processArgv)
       
    }
    
    getCookies(req,res){
        
        var startTimingRenewal
        const sequence = new Promise((resolve,reject)=>{
        this.db.serialize(() => {
           
            let index  = 0
            
            this.db.each(`SELECT COUNT(*),* FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.tokenSession, 0], (err, row) => {
                
                if (err) { console.error(err.message); }
                
                if(row.startTimingRenewal){
                if(index==(row['COUNT(*)']-1)){
                    startTimingRenewal = row.startTimingRenewal
                    resolve(startTimingRenewal)
                    
                    index++
                    }
                }

                })
        
            })

        }).then(response=>{
            
            res.cookie('basicTwoFAuth_0', new Date().getTime(), { maxAge: 24*60*60*1000, httpOnly:false});        
            res.cookie('basicTwoFAuth_1', response, { maxAge: 24*60*60*1000, httpOnly: false });
            res.cookie('basicTwoFAuth_2', `${ req.body.tokenSession }` , { maxAge: 24*60*60*1000, httpOnly: false });
            res.send({ action: 0, status:'success', description:'Cookies were successfully sent' })

        })
    
    
    
    
    
    }
}

module.exports = Cookies