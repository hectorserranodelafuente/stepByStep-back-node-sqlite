const sqlite3 = require('sqlite3').verbose();
const env = require('../env.js')
const Auth = require('../modules/api/auth.js')

function secureTarget(){
    return (new Auth(process.argv).actualEnvironment==='test') ? true :false
}



function reset(){
    
    
    let promise1,promise2,promise3,promise4,promise5
    if(secureTarget()){
        
        
        new Auth(process.argv).db.serialize(() => {
                promise1  = new Promise((resolve,reject)=>{   
                new Auth(process.argv).db.run('DELETE FROM changePassword',function(err){
                    resolve()})
                })
            
                promise2 = new Promise((resolve,reject)=>{  
                new Auth(process.argv).db.run(`DELETE FROM preUsers`,function(err){
                    resolve()})
                })

                promise3 = new Promise((resolve,reject)=>{
                new Auth(process.argv).db.run(`DELETE FROM session`,function(err){
                    resolve()})
                })
            
                promise4 = new Promise((resolve,reject)=>{
                new Auth(process.argv).db.run(`DELETE FROM twoFA`,function(err){
                    resolve()})
                })
            

                promise5 = new Promise((resolve,reject)=>{
                new Auth(process.argv).db.run(`DELETE FROM users`,function(err){
                    resolve()})
                })
        
        
        })
        
    }else{
        console.log('We have not reset db, you are not in test environment')
    }
    return Promise.all([promise1,promise2,promise3,promise4,promise5])

}

 exports.reset=reset