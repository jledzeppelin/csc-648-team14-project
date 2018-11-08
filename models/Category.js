const BaseModel = require('./BaseModel')
/**
 * @description The model for a Category. It inherits the BaseModel's generic functionality.
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


    get parent_category_id() {
        return this._parent_category_id
    }

    set parent_category_id(value) {
        this._parent_category_id = value
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
        let sql =  `SELECT {_category_name} FROM ${this.__TABLE}`
        let allCategories = super.getMultipleBySQL(Category , sql )
        return allCategories
    }

    /**
     * @description Convert the result from the DB to a new Post object
     * @param result {object} The result from the Database.
     * @returns {Cateory} The instantiated Category object
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static objectMapper(result){
        let newCategory = new Category()

        // Take all the values and put them in the new object
        newCategory.id = result.id
        newCategory.category_name = result._category_name
        newCategory.parent_category_id = result._parent_category_id

        return newCategory
    }

    /**
     * @description This is what will be returned when converting the object to JSON.
     * @returns {{id: *, category_name: *, parent_category_id}}
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    toJSON() {
        return {
            id: this.id,
            category_name : this._category_name,
            parent_category_id: this._parent_category_id
        }
    }


}// end of Category

// Required. This specifies what will be imported by other files
module.exports = Category