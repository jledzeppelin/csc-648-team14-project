const BaseModel = require('./BaseModel')

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

    //need a get password?

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
}