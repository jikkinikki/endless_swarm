
export default class Component {

    constructor() {

    }

    onAdd() {

    }


    tick() {

    }

    after() {

    }
    
    onRemove(){

        
    }

    render() {

    }

    clone() {

        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        return clone;
    }
}