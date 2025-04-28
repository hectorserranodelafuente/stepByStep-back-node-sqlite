const env = require('../../env.js')
const Auth = require('./auth.js')

let sqlite3 = require('sqlite3').verbose();

class AuthWrapper{

constructor(){}

    async instance(processArgv){
        
        let data
        let actualEnvironment
        processArgv.forEach(function (val, index, array) {
            
            if(index>1){
                if(val.split('=')[0]==="environment"){
                    actualEnvironment=val.split('=')[1]
                }
            }
        })
 
        data = await env[actualEnvironment]()
        
        
        return new Auth( processArgv, data)
    }

}


module.exports = AuthWrapper

