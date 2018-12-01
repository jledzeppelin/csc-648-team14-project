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
        return this._user_id
    }
    set post_id(post_id){
        this._user_id = post_id
    }

    get sender_id() {
        return this._category_id
    }
    set sender_id(sender_id) {
        this._category_id = sender_id
    }

    get recipient_id() {
        return this._category_id
    }
    set recipient_id(recipient_id) {
        this._category_id = recipient_id
    }

    get last_revised() {
        return this._last_revised
    }

    set last_revised(last_edit_date) {
        this._last_revised = last_edit_date
    }

    get initial_send_date() {
        return this._create_date
    }

    set initial_send_date(sent_date) {
        this._create_date = sent_date
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
    static get __TABLE(){return "table"}

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
     * @description Convert the result from the DB to a new Message object
     * @param result {object} The result from the Database.
     * @returns {Post} The instantiated Message object
     * @author Jack Cole
     * @author Ryan Jin
     */
    static objectMapper(result){
        let newMessage = new Message()

        // Take all the values and put them in the new object
        newMessage.id = result.id
        newMessage.post_id = result.post_id
        newMessage.sender_id = result.sender_id
        newMessage.recipient_id = result.recipient_id
        newMessage.initial_send_date = result.initial_send_date
        newMessage.last_revised = result.last_revised

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
            initial_send_date : this.initial_send_date,
            last_revised : this.last_revised,
        }
    }
}

// Required. This specifies what will be imported by other files
module.exports = Message
