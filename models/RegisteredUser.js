const BaseModel = require('./BaseModel')

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

    /**
     * @description Inserts new post to db
     * @returns {Promise} A confirmation of the new post being added
     * @author Juan Ledezma
     */
    static insertNewRecord(newUser) {
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
                        if (login_password == results[0].login_password) {
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