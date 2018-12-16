const BaseModel = require('./BaseModel')

/**
 * @description The model for a Message. It inherits the BaseModel's generic functionality.
 * @author Ryan Jin
 */
class Message extends BaseModel{

    get id(){
        return this.__id
    }

    set id(id){
        this.__id = id
    }

    get post_id(){
        return this._post_id
    }

    set post_id(post_id){
        this._post_id = post_id
    }

    get sender_id() {
        return this._sender_id
    }

    set sender_id(sender_id) {
        this._sender_id= sender_id
    }

    get recipient_id() {
        return this._recipient_id
    }

    set recipient_id(recipient_id) {
        this._recipient_id = recipient_id
    }

    get sent_date() {
        return this._sent_date
    }

    set sent_date(sent_date) {
        this._sent_date = sent_date
    }

    get message() {
        return this._message
    }

    set message(message) {
        this._message = message
    }

    constructor(){
        super()
    }

    /**
     * @description The table in the database that Table is stored in.
     * @returns {string} The table name
     * @private
     * @author Jack Cole
     * @author Ryan Jin
     */
    static get __TABLE(){return "message"}

    /**
     * @description Inserts new message to db
     * @returns {Promise} A confirmation of the new message being added
     * @author Juan Ledezma
     * @author Ryan Jin
     */
    static insertNewRecord(messageSent) {
        let result = super.insertNewRecord(Message, messageSent)
        return result
    }

    /**
     * @description Grab a sigle post matching the id from the database
     * @returns {Promise} A post with the data matching the id in the database
     * @author Jack Cole jcole2@mail.sfsu.edu
     * @author Ryan Jin
     */
    static getSingleMessage(id){
        return super.getSingleRowById(Message, {id:id})
    }

    /**
     * @description Returns all messages based on Post_ID
     * @returns
     * @author Ryan Jin
     */
    static getAllMessages(post_id){
        let sql_command = `SELECT * FROM ${this.__TABLE} WHERE post_id = ${post_id}`
        return super.getMultipleBySQL(Message, sql_command)
    }


    /**
     * @description Convert the result from the DB to a new Message object
     * @param result {object} The result from the Database.
     * @returns {Post} The instantiated Message object
     * @author Jack Cole
     * @author Ryan Jin
     */
    static objectMapper(result){
        let newMessage = new Message()

        // Take all the values and put them in the new object
        newMessage.id = result.message.id
        newMessage.sender_id = result.message.sender_id
        newMessage.recipient_id = result.message.recipient_id
        newMessage.sent_date = result.message.sent_date
        newMessage.post_id = result.message.post_id
        newMessage.message = result.message.message

        //newMessage.post_title = result.post_title
        return newMessage
    }

    /**
     * @description This is what will be returned when converting the object to JSON.
     * @returns {{id: *, user_id: *, category_id: *, create_date: *, post_title: *, post_description: *, post_status: *, price: *, is_price_negotiable: *, last_revised: *, number_of_images: *, image_location: *}}
     * @author Jack Cole jcole2@mail.sfsu.edu
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     * @author Ryan Jin
     */
    toJSON() {
        return {
            id: this.id,
            post_id : this.post_id,
            sender_id : this.sender_id,
            recipient_id : this.recipient_id,
            sent_date : this.sent_date,
            message : this.message
        }
    }
}

// Required. This specifies what will be imported by other files
module.exports = Message
