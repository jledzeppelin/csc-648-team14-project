const BaseModel = require('./BaseModel')
const RegisteredUser = require('./RegisteredUser')
const Post = require('./Post')

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

    get post(){
        return this._post
    }

    set post(post_id){
        this._post = post_id
    }

    get sender() {
        return this._sender
    }

    set sender(sender_id) {
        this._sender= sender_id
    }

    get recipient() {
        return this._recipient
    }

    set recipient(recipient_id) {
        this._recipient = recipient_id
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
        let sql_command = `SELECT *  from ${this.__TABLE}
 LEFT JOIN registered_user sender
ON sender.id = message.sender_id
  LEFT JOIN registered_user recipient
ON recipient.id = message.recipient_id
  LEFT JOIN post
ON message.post_id = post.id
WHERE
  message.id = ${id}`
        return super.getMultipleBySQL(Message, sql_command)
    }

    /**
     * @description Returns all messages based on Post_ID
     * @param post_id {Number} An array of post_ids
     * @param user_id {Number} The id of one user
     * @param other_user_id {Number} The id of other user
     * @returns
     * @author Ryan Jin
     */
    static getAllMessages(post_id, user_id, other_user_id){

        let sql_command = `SELECT *  from ${this.__TABLE}
 LEFT JOIN registered_user sender
ON sender.id = message.sender_id
  LEFT JOIN registered_user recipient
ON recipient.id = message.recipient_id
  LEFT JOIN post
ON message.post_id = post.id
WHERE
  message.post_id = ${post_id}
  AND 
  (
    (sender_id = ${user_id} AND recipient_id = ${other_user_id})
    OR 
    (recipient_id = ${user_id} AND sender_id = ${other_user_id})
  )`
        return super.getMultipleBySQL(Message, sql_command)
    }

    /**
     * @description Returns all the latest messages, unique to each post and user
     * @param user_id {Number} The user_id of the person partaking in the messages
     * @returns
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getLatestMessages(user_id){

        let sql_command = `SELECT *  from ${this.__TABLE}
 INNER JOIN (SELECT MAX(sent_date) as sent_date
             FROM message
             WHERE
                 sender_id = ${user_id}
                OR
                 recipient_id = ${user_id}
             GROUP BY sender_id, recipient_id) t2
            ON message.sent_date = t2.sent_date
 LEFT JOIN registered_user sender
ON sender.id = message.sender_id
  LEFT JOIN registered_user recipient
ON recipient.id = message.recipient_id
  LEFT JOIN post
ON message.post_id = post.id
WHERE
  sender_id = ${user_id}
  OR
  recipient_id = ${user_id};`
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
        let sender = new RegisteredUser()
        let recipient = new RegisteredUser()
        let post = {}

        sender.id = result.sender.id
        sender.first_name = result.sender.first_name

        recipient.id = result.recipient.id
        recipient.first_name = result.recipient.first_name

        post.id = result.post.id
        post.post_title = result.post.post_title
        post.user_id = result.post.user_id

        // Take all the values and put them in the new object
        newMessage.id = result.message.id
        newMessage.sender = sender
        newMessage.recipient = recipient
        newMessage.sent_date = result.message.sent_date
        newMessage.post = post
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
            post : this.post,
            sender : this.sender,
            recipient : this.recipient,
            sent_date : this.sent_date,
            message : this.message
        }
    }
}

// Required. This specifies what will be imported by other files
module.exports = Message
