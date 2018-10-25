const SETTINGS = require('../settings')
const mysql = require('mysql')




/**
 * @description The Model from which all other models will inherit. Has basic functionality for connecting to the DB.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class BaseModel{

    constructor(){
    }

    /**
     * @description Returns the name of the table in the database. Subclasses must overwrite this.
     * @returns String The table name in the database.
     * @private
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    get __TABLE(){throw "Not implemented"}

    /**
     * @description Connects to the database server and returns the connection object
     * @returns {Connection}
     * @private
     */
    static __connect(){
        let connection = mysql.createConnection({
            host     : SETTINGS.db.host,
            user     : SETTINGS.db.user,
            password : SETTINGS.db.password,
            database : SETTINGS.db.database,
        })
        connection.connect()
        return connection
    }

    /**
     * @description Disconnects the connection from the database server
     * @param connection {Connection}
     * @returns {*}
     * @private
     */
    static __disconnect(connection){
        return connection.end()
    }

    /**
     * @description Performs a query to the database.
     * @param connection {Connection} A connection that has been instantiated by __connect()
     * @param sql {String} The SQL query
     * @param callback {function} The function to execute after the query
     * @returns {*|Function}
     * @private
     */
    static __query(connection, sql, callback){
        return connection.query(sql, callback)
    }

    /**
     * @description Returns an Object containing the values from a single row. Since this shall be statically called, we need
     * to pass in the super class in the argument "model".
     * @param id The id of the row as it appears in the database. Must be an integer.
     * @param model {BaseModel} The model of the object that is being created
     * @returns {Promise} The instantiated object of this class
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getSingleRowById(id, model){
        let table = model.__TABLE
        let sqlCommand = `SELECT * FROM ${table} WHERE id = ${id}`

        return new Promise(function(resolve, reject){
          let connection = BaseModel.__connect();

            BaseModel.__query(connection, sqlCommand, function (err, rows, fields) {
              if (err) throw err
              let data = {}
              if(rows.length !== 0)
                data = rows[0]
              resolve(model.objectMapper(data))
            })
            BaseModel.__disconnect(connection);
        })
    }

    /**
     * @description Takes the response from the database, and instantiates an object of this class and fills its values with this data.
     * @param data The data from the database
     * @returns BaseModel The instantiated object of this class
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static objectMapper(data){
        let obj = BaseModel()
        return obj
    }
}

// Required. This specifies what will be imported by other files
module.exports = BaseModel