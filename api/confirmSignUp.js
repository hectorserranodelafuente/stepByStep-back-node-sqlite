const Auth = require('./auth.js')
const logger = require('../logger/logger.js')
const ejs = require('ejs')
const path = require('path')

class ConfirmSignUp extends Auth{

        constructor(processArgv){

            super(processArgv)

        }

        confirmSignUp(req,res){
            
            const sequence = new Promise( (resolve, reject) =>{
                
                if(!req.query.ts){
            
                  const templatePath = path.join(__dirname,'../../public/ejs/confirmSignUpGenericError.ejs');
                  const data = {};
            
                  let html = ejs.renderFile(templatePath, data, (err, str) => {
                      if (err) {
                        console.error('Error al renderizar el template:', err);
                      } else {
                        res.send(str)
                        console.log('Template renderizado con éxito:', str);
                      }
                      reject()
                  });
              
                }else{
                  resolve(res)
                } 
                
              }).then( response => {
                
                return new Promise((resolve,reject)=>{
                this.db.serialize(() => {
                  
                  let index = 0
                  this.db.each(`SELECT * FROM preUsers WHERE (tokenPreUsers = ? AND confirmed = ?)`, [req.query.ts,0], (err, row) => {
                  if (err) {
                    console.error(err.message);
                    reject()
                  }
                  
                  if(row.email){
                    if(index==0){
                        
                        const insertionUser = this.db.prepare(`INSERT INTO users VALUES (?,?,?,?,?,?,?)`)
                        insertionUser.run(row.email,row.name,row.password, row['twoFA'],row.addition,row['typeTwoFA'],row.phoneNumber)
                        insertionUser.finalize()
                      
                       
                        const updatePreUser = this.db.prepare(`UPDATE preUsers SET confirmed=?,finished=? WHERE tokenPreUsers=?`)
                        updatePreUser.run(1, 1,req.query.ts)
                        updatePreUser.finalize()
                        
                      
                        const templatePath = path.join(__dirname,'../../public/ejs/confirmSignUpSuccess.ejs');
                        const data = { email: row.email };
            
                        let html = ejs.renderFile(templatePath, data, (err, str) => {
                            if (err) {
                              console.error('Error al renderizar el template:', err);
                            } else {
                              res.send(str)
                              console.log('Template renderizado con éxito:', str);
                            }
                            reject()
                          });
                        
                        index++
                      }    
                  }
                },(err)=> resolve(res));
                })
              })
            
              }).then(response=>{
                
                
                
                const templatePath = path.join(__dirname,'../../public/ejs/confirmedBeforeSignUp.ejs');
                const data = {};
            
                let html = ejs.renderFile(templatePath, data, (err, str) => {
                    if (err) {
                      console.error('Error al renderizar el template:', err);
                    } else {
                      res.send(str)
                      console.log('Template renderizado con éxito:', str);
                    }
                    
                  });
                
                
            
              }).catch( err => {
               console.log( err ) 
              })
            
            }



        }


module.exports = ConfirmSignUp