const Auth = require('./auth.js')

class RenewalSession extends Auth {

    constructor(processArgv){
        super(processArgv)
        
    }   

    renewalSession(req,res){

        let now = new Date().getTime()

        let sequence = new Promise((resolve,reject) => {
        
                    this.db.serialize(() => {
                    
                    let index = 0
                    
                    let periodTimingSession =   this.periodExpiringSession
                    let periodTimingRenewalSession = this.periodRenewalSession
                    
                    let onRenewalTime = false
                    let newStartTiming
                    let newEndTiming
                    let newStartTimingRenewal
                    let newEndTimingRenewal
                    try{
                        this.db.each(`SELECT * FROM session WHERE tokenSession = ? AND finished = ?`, [req.body.tokenSession,0], (err, row) => {
                            
                            if (err) { console.error(err.message); reject();}
                            
                            if(row.startTiming){
                            
                            if(index==0) {
                               
                                
                                if(now >= row.startTimingRenewal && now <= row.endTimingRenewal ){
                                onRenewalTime = true
                                } 
                                
                                newStartTiming = now 
                                newEndTiming = now + periodTimingSession
                                newStartTimingRenewal = newEndTiming 
                                newEndTimingRenewal = newEndTiming+periodTimingRenewalSession
                                resolve({ 
                                    onRenewalTime:onRenewalTime,
                                    newStartTiming:newStartTiming, 
                                    newEndTiming:newEndTiming,
                                    newStartTimingRenewal:newStartTimingRenewal,    
                                    newEndTimingRenewal:newEndTimingRenewal
                                })
                                
                                }
                                
                                index++
                            }  
                            },(_res)=> reject({description:'no active session found'}));

                    }catch(err){ reject({description:'some error happened'}) }
                    
                    });

        }).then( response => {
            
            return new Promise((resolve,reject) => {
                
            if(response.onRenewalTime){
                
                try{
                    this.db.serialize(() => {  
                    
                    const updateSession = this.db.prepare(`UPDATE session SET startTiming = ?, endTiming = ?, startTimingRenewal = ?, endTimingRenewal = ? WHERE tokenSession=?`)
                          updateSession.run( response.newStartTiming, response.newEndTiming, response.newStartTimingRenewal, response.newEndTimingRenewal, req.body.tokenSession )
                          updateSession.finalize()
                          
                          resolve({status:'success', description:'session renewed',db:response})
                
                    })
                }catch(err){
                    
                    reject({status:'error', description:'some error happened on updating session' })
                
                }
                
            }else{
                reject({description:'not in renewal'})
            }

            })


            }).then(response=>{
            
            
            res.cookie('basicTwoFAuth_0', new Date().getTime() , { maxAge: 24*60*60*1000, httpOnly: false })
            res.cookie('basicTwoFAuth_1', response.db.newStartTimingRenewal, { maxAge: 24*60*60*1000, httpOnly: false });
            
            
            res.json({ action: 0, description:response.description })
            logger.log( this.dirPathLogger, this.logsFileName, `${new Date()} success renewing session ${response.db.newStartTimingRenewal}` )

            
            return
            
            
            }).catch(err=>{ 
            
            res.json({ action: 1, description:err.description})
            

            })




    }



}

module.exports = RenewalSession