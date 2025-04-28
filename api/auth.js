const env = require('../../env.js')
let sqlite3 = require('sqlite3').verbose();


class Auth{

constructor(processArgv){

    this.actualEnvironment
    this.dirPathProject
    this.dirPathLogger
    this.logsFileName
    this.dbSqlitePath
    this.domainName
    this.transporterHost
    this.transporterPort
    this.transporterSecure
    this.transporterAuthUser
    this.transporterAuthPass
    this.transporterTlsRejectUnauthorized
    this.mailOptionsFrom
    this.frontTech
    
    

    const scope = this
    
    processArgv.forEach(function (val, index, array) {
        
        if(index>1){
            if(val.split('=')[0]==="environment"){
                scope.actualEnvironment=val.split('=')[1]
                scope.dirPathProject = env[scope.actualEnvironment].dirPathProject
                scope.dirPathLogger = env[scope.actualEnvironment].dirPathLogger
                scope.logsFileName = env[scope.actualEnvironment].logsFileName
                scope.dbSqlitePath = env[scope.actualEnvironment].dbSqlitePath
                scope.domainName = env[scope.actualEnvironment].domain
                scope.transporterHost = env[scope.actualEnvironment].transporter.host
                scope.transporterPort = env[scope.actualEnvironment].transporter.port
                scope.transporterSecure = env[scope.actualEnvironment].transporter.secure
                scope.transporterAuthUser = env[scope.actualEnvironment].transporter.auth.user
                scope.transporterAuthPass = env[scope.actualEnvironment].transporter.auth.pass
                scope.transporterTlsRejectUnauthorized = env[scope.actualEnvironment].transporter.tls.rejectUnauthorized
                scope.mailOptionsFrom = env[scope.actualEnvironment].mailOptions.from
                //scope.type2FA = env[scope.actualEnvironment].type2FA
                scope.smsUsername = env[scope.actualEnvironment].confSMS.username
                scope.smsToken = env[scope.actualEnvironment].confSMS.token
                scope.frontTech = env[scope.actualEnvironment].frontTech
          }
        }
    });

    if (!Auth.instance) {
    
      this.db =  new sqlite3.Database(scope.dbSqlitePath)

    }
    
    
    this.periodExpiringSession = 1*60*1000
    this.periodRenewalSession = 2*60*1000 
    this.periodExpiringPreUsers = 2*60*1000
    this.periodExpiring2FA = 2*60*1000
    this.tryEstablishedByDefault = 2
    this.tokensLength = 80
    this.code2FALength = 6
    this.additionLength = 4


    this.urlCharacters = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ]
    this.numberCharacters = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ]
    this.specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', "'", '"', '<', '>', ',', '.', '/', '?', '|', '\\']
    
}


}

module.exports = Auth