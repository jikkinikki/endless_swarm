class PersistantData {

    constructor(){

        this._data = {};
    }

    addData(key, value, override = false){

        if(!override && this.keyExists(key))
            return;

        this._data[key] = value;
    }

    getData(key){
        return this._data[key];
    }

    keyExists(key){
        return this._data[key] !== undefined;
    }

    removeData(key){

        delete this._data[key];
    }
}

export default new PersistantData();