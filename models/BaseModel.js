class BaseModel{

    constructor(){
        this.__TABLE = ""
    }

    /**
     * @description Returns an Object containing the values from a single row
     * @param id The id of the row as it appears in the database. Must be an integer.
     * @returns BaseModel The instantiated object of this class
     * @authors Jack
     */
    getSingleRowById(id){
        let table = this.__TABLE
        // Some MySQL commands
        let data = {}
        let mappedObject = this.objectMapper(data)
    }

    /**
     * @description Takes the response from the database, and instantiates an object of this class and fills its values with this data.
     * @param data The data from the database
     * @returns BaseModel The instantiated object of this class
     * @authors Jack
     */
    objectMapper(data){
        let obj = BaseModel()
        return obj
    }
}

module.exports = BaseModel