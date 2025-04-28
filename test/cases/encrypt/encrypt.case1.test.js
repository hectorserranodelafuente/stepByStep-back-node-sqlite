
const { Emulate, Mocker } = require('../../../node_modules/emulate/main/expect.js')
const {Accumulator} = require('../../../node_modules/emulate/main/accumulator.js')
const { Case }  = require('../../../node_modules/emulate/main/case.js')
const { Socket } = require('../../../node_modules/emulate/main/socket.js')
const   UtilsAuth  = require('../../../modules/api/utilsAuth.js')
const crypto = globalThis.crypto;

const {
    scrypt,
    randomFill,
    createCipheriv,
  } = require('node:crypto');


class EncryptPassword{

    constructor( index, end, callback, socket){
        
        this.case = new Case( index, end, callback, socket )
        this.callback = callback
    }

    testCipher( processArgv, res, ...args ){
        
        let scope = this

        new UtilsAuth(processArgv)
            .aesEncrypt(args)
            .then( ( response ) => {
                
                const { key, iv, ciphertext } = response
                return new UtilsAuth(processArgv).aesDecrypt(ciphertext,key,iv)

            }).then( (_response) => {
                res.json({  decryptedPassword: _response })

            })
    
    }

    main(processArgv,socket) {
        
        let toBeEncrypted = 'contrasena@2025' 
        let scope = this
        
        let res = new Emulate(
            'case 23',
            'TestCipher "Encrypted" parameter equal to function response \n',
            'json',
            {   
                decryptedPassword: toBeEncrypted  
            },
            scope.case.resolves [  
                scope.case.index 
            ],
            socket,
            22)
            
            

            let args = [
                toBeEncrypted
            ]
            
            scope.testCipher( processArgv, res, ...args )
                
    }

}

module.exports = EncryptPassword

