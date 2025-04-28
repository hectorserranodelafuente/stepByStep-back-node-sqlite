const Auth = require('./auth.js')

class StateSession extends Auth{

    constructor(processArgv){
        super(processArgv)
    }
    
    stateSession(req,res){

        this.db.serialize(() => {
            let index=0
            this.db.each(`SELECT COUNT(*),* FROM session WHERE tokenSession = ? AND finished = ? AND starTimingRenewal <= ?  AND endTimingRenewal >= ?`, [req.body.tokenSession, 0, req.body.time, req.body.time], (err, row) => {
                
                if (err) { console.error(err.message); }
                
                if(row.starTiming){
                    if(index==(row['COUNT(*)']-1)){
                        res.json({ tokenSession:req.body.tokenSession, startTiming:row.startTiming , endTiming:row.endTiming, startTimingRenewal:row.startTimingRenewal, endTimingRenewal:row.endTimingRenewal })
                        index++
                    }
                }
        
            },(err)=> res.json({tokenSession:req.body.tokenSession}))
        })
    }

}

module.exports = StateSession