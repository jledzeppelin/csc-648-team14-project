const BaseModel = require('BaseModel')

class Post extends BaseModel{



    constructor(){
        super()
        this.__TABLE = "post"
    }

    objectMapper(data){
        let obj = Post()

        obj.id = data.id

        return obj
    }


}


