const BaseModel = require('./BaseModel')
/**
 * @description The model for Category. It inherits the BaseModel's generic functionality.
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */

class Category extends BaseModel{

    get id(){
        return this.__id
    }

    set id(id){
        this.__id = id
    }

    get category_name() {
        return this._category_name
    }

    set category_name(value) {
        this._category_name = value
    }


    constructor(){
        super()
    }

    /**
     * @description The table in the database that Category is stored in.
     * @returns {string} The table name
     * @private
     * @author Anthony Carrasco acarras4@mail.sfsu
     */
    static get __TABLE(){return "category"}



    /**
     * @description Returns all Categories
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */

    static getAllCategories (){
        let sql =  `SELECT * FROM ${this.__TABLE} `
        let allCategories = super.getMultipleBySQL(Category , sql )
        return allCategories
    }

    /**
     * @description Convert the result from the DB to a new Post object
     * @param result {object} The result from the Database.
     * @returns {Category} The instantiated Category object
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static objectMapper(result){
        let newCategory = new Category()

        // Take all the values and put them in the new object
        newCategory.id = result.id
        newCategory.category_name = result.category_name

        return newCategory
    }

    /**
     * @description This is what will be returned when converting the object to JSON.
     * @returns {{id: *, category_name: *}
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    toJSON() {
        return {
            id: this.id,
            category_name : this.category_name
        }
    }


}// end of Category

// Required. This specifies what will be imported by other files
module.exports = Category