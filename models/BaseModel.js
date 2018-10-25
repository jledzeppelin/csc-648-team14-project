const SETTINGS = require('../SETTINGS')
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

    //insert new user 
    //maybe this needs to be a generic insert new record function
    static createNewUser(newUser, model){
        let table = model.__TABLE
        let sqlCommand = `INSERT INTO ${table} SET ?`

        return new Promise(function(resolve, reject){
            let connection = BaseModel.__connect();

            connection.query(sqlCommand, newUser, function (err, rows, fields) {
                if (err) throw err
                
                let data = {}
                if (rows.length !== 0) {
                    data = rows
                }

                resolve(model.objectMapper(data))
            })
            connection.end();
        })

        //******************** LEFT OFF HERE ********************************

        /*
        return new Promise(function(resolve, reject){
            let connection = BaseModel.__connect();

            BaseModel.__query(connection, sqlCommand, function (err, rows, fields) {
                if (err) throw err

                let data = {}
                if (rows.length !== 0) {
                    data = rows
                }

                resolve(model.objectMapper(data))
            })

            BaseModel.__disconnect(connection);
        })
        */
    }

    /**
     * @description Returns all post corresponding to category_id
     * @param category_id - id of category
     * @returns Category - with all post in that category
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static getCategory(category_id, model){
        let data = { category_id: category_id} // Placeholder , the actual values of the result should be stored in here.

        // TODO: Add MySQL query commands lookup the item in the DB

        /*
        SELECT * FROM 'Name Of DB'
        WHERE category_id = 'category_id' AND post_status = 'true'
        */

        return Category
    }

    /**
     * @description Returns all recent approved post
     * @returns latestApproved - All recent approved post
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */

     /*
    static getLatestApprovedPost(model){
        let table = model.__TABLE
        let sqlCommand = `SELECT * FROM ${table} WHERE post_status = 'Approved' ORDER BY _create_date DESC  `
        return new Promise(function(resolve, reject){
            connection.connect()

            connection.query(sqlCommand, function (err, rows, fields) {
                if (err) throw err
                //TODO: Fix corection of rows [] to take multiple post
                let newObject = model.objectMapper(rows[])
                resolve(newObject)

            })

            connection.end()
        })
    }
    */

    
    //TODO: Fix sqlCommand for searchPosts()
    /**
     * @description Returns search results
     * @param name -
     * @param category -
     * @param page -
     * @param sort -
     * @param model -
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */

     /*
    static searchPosts(name,category,page,sort,model){
        let table = model.__TABLE
        let sqlCommand = `SELECT * FROM ${table} WHERE post_status = 'Approved' AND category_id = ${category} AND _post_title: ${sort} `
        return new Promise(function(resolve, reject){
            connection.connect()

            connection.query(sqlCommand, function (err, rows, fields) {
                if (err) throw err
                //TODO: Fix corection of rows [] to take multiple post
                let newObject = model.objectMapper(rows[])
                resolve(newObject)

            })

            connection.end()
        })
    }
    */

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