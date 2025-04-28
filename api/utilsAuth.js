const Auth = require('./auth.js')

const { subtle } = globalThis.crypto;

const {

  scrypt,
  randomFill,
  createCipheriv,
  createDecipheriv

} = require('node:crypto')

const { Buffer } = require('node:buffer')
const nodemailer = require('nodemailer');
const { createHmac } = require('node:crypto');

class UtilsAuth extends Auth{
    
    constructor(processArgv){ super(processArgv)  }
    
    async generateAesKey(length = 256) {
      
      const key = await subtle.generateKey({
        name: 'AES-CBC',
        length,
      }, true, ['encrypt', 'decrypt']);

      const dataKey = { 
        name: 'AES-CBC', 
        length: length, 
        bool: true, 
        arr:['encrypt','decrypt'] 
      }
      
      return { key, dataKey };
    
    }
     

    async aesEncrypt(plaintext) {
      
      const ec = new TextEncoder();
      const { key, dataKey} = await this.generateAesKey();
      const iv = crypto.getRandomValues(new Uint8Array(16));
    
      const ciphertext = await crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv,
      }, key, ec.encode(plaintext));
    
      return {
        dataKey,
        iv,
        ciphertext,
      }
    
    }

    async aesDecrypt(ciphertext, key, iv) {
      
      const dec = new TextDecoder();
      const plaintext = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
      }, key, ciphertext);
    
      
      return dec.decode(plaintext);
    
    } 
    

    
    generateToken( lengthToken){
        let character,
            sessionToken=""
        for(var i=0;i<lengthToken;i++){
          character = this.urlCharacters[ parseInt(Math.random()*this.urlCharacters.length) ]
          sessionToken+=character
        }
        return sessionToken
      }
      
    encryptPassword(password,length){
        
        let encryptedPassword
        let addition = this.generateToken(this.additionLength)
        encryptedPassword = createHmac('sha256',addition)
                      .update(password)
                      .digest('hex');
      
        return { 
          addition:addition, 
          encryptedPassword:encryptedPassword 
        }
      
      }
      
    validatePswrd(password, minLength, maxLength){
        
        let firstValidation, secondValidation, thirdValidation, fourthValidation
            firstValidation = password.split('').every( char => {
              return this.urlCharacters.includes(char) || this.specialCharacters.includes(char) || this.numberCharacters.includes(char)
            })
            secondValidation = password.split('').some( char => this.specialCharacters.includes(char) )
            thirdValidation = password.split('').some( char => this.numberCharacters.includes(char) )
            fourthValidation = (password.length >= minLength && password.length <= maxLength)
        
        
        if(!firstValidation||!secondValidation||!thirdValidation||!fourthValidation){
          return false
        }
        
        return true
      }
      
    validateUrlName(name){ 
        return !name.split('').some( character=> !this.urlCharacters.includes(character) )
    }
      
    validate2FA(doubleFA){
        return doubleFA===0||doubleFA===1
    }

    validatePhoneNumber(phoneNumber){
      const phoneRegExp = /\d{4,14}$/
      return phoneRegExp.test( phoneNumber )
    }
}

module.exports = UtilsAuth