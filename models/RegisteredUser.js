const BaseModel = require('./BaseModel')
const crypto = require('crypto')

/**
 * @description The model for a registeredUser. It inherits the BaseModel's generic functionality.
 * @author Juan Ledezma
 */
class RegisteredUser extends BaseModel {
    get id(){
        return this.__id
    }

    set id(id){
        this.__id = id
    }

    get first_name(){
        return this._first_name
    }

    set first_name(first_name){
        this._first_name = first_name
    }

    get last_name(){
        return this._last_name
    }

    set last_name(last_name){
        this._last_name = last_name
    }

    get email(){
        return this._email
    }

    set email(email){
        this._email = email
    }

    get login_password(){
        return this._login_password
    }

    set login_password(pw){
        this._login_password = pw 
    }

    get is_banned(){
        return this._is_banned
    }

    set is_banned(bool){
        this._is_banned = bool
    }

    constructor(){
        super()
    }

    static get __TABLE(){
        return "registered_user"
    }

    //****** PASSWORD HASHING *********

    /**
     * @description Hashes password
     * @param password 
     * @author Juan Ledezma
     */
    static hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex')
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex')
        return [salt, hash].join('$')
    }

    /**
     * @description Verifies that a given password matches stored password
     * @param password Password to check
     * @param original Stored password
     * @author Juan Ledezma
     */
    static verifyHash(password, original) {
        const originalHash = original.split('$')[1]
        const salt = original.split('$')[0]
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex')

        return hash === originalHash
    }

    //****** PASSWORD HASHING END *********


    /**
     * @description Inserts new post to db
     * @returns {Promise} A confirmation of the new post being added
     * @author Juan Ledezma
     */
    static insertNewRecord(newUser) {
        newUser["login_password"] = this.hashPassword(newUser["login_password"])
        let result = super.insertNewRecord(RegisteredUser, newUser)

        return result
    }

    static authenticateUser(email, login_password) {
        let sql = `SELECT * FROM ${this.__TABLE} WHERE email = ?`

        return new Promise(function(resolve, reject) {
            let connection = BaseModel.__connect()

            connection.query(sql, [email], function(err, results, fields) {
                if (err) {
                    throw err
                } else {
                    if (results.length > 0) {
                        if (RegisteredUser.verifyHash(login_password, results[0].login_password)) {
                            resolve({
                                status:true,
                                message:"Successfully authenticated user"
                            })
                        } else {
                            resolve({
                                status:false,
                                message:"Email and password do not match!"
                            })
                        }

                    } else {
                        resolve({
                            status:false,
                            message:"Email does not exist!"
                        })
                    }
                }
            })
            
            connection.end()
        })
    }

    static objectMapper(result){
        let newRegisteredUser = new RegisteredUser()

        newRegisteredUser.id = result.id
        newRegisteredUser.first_name = result.first_name
        newRegisteredUser.last_name = result.last_name
        newRegisteredUser.email = result.email
        newRegisteredUser.login_password = result.login_password
        newRegisteredUser.is_banned = result.is_banned

        return newRegisteredUser
    }

    toJSON() {
        return {
            id : this.id,
            first_name : this.first_name,
            last_name : this.last_name,
            email : this.email,
            login_password : this.login_password,
            is_banned : this.is_banned
        }
    }
}

module.exports = RegisteredUser