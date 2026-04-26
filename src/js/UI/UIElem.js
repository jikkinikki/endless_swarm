import UI from "./UI"

export default class UIElem extends UI {

    constructor(pos, size, elemId) {

        super(pos, size)

        this._elem = document.getElementById(elemId);

        if (this._elem == undefined)
            console.log("missing id:", elemId);

        this._defaultVisible = this.getVisible();
    }

    createElement(type, text, parent, id, classList) {

        let elem = document.createElement(type);
        elem.textContent = text;

        if (id != "")
            elem.id = id;

        if (classList)
            elem.classList.add(...classList);

        parent.appendChild(elem);

        return elem;
    }

    getElem(){

        return this._elem;
    }

    getVisible(){
        return !this._elem.classList.contains("hidden");
    }

    setVisible(visible) {

        if (!visible)
            this._elem.classList.add("hidden");
        else
            this._elem.classList.remove("hidden");
    }

    onRemove(){

        this.setVisible(this._defaultVisible);
    }
}

/*
Ladda in ett html element från index.html

*/ 