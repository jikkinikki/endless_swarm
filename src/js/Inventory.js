/**
 * @typedef {import('./items/Item').default} Item
 */

export default class Inventory {

    constructor() {

        /**
         * @type {Item[]}
         */
        this._items = [];
    }

    /**
     * 
     * @param {Item} item 
     * @param {Number} count 
     */
    addItem(item, count) {

        count = count || 1;

        let key = item.customInvName ? item.customInvName() : this.itemToKey(item);

        const itemIndex = this._getItemIndex(key, 1);

        if (itemIndex == -1)
            this._items.push({

                "key": key,
                "obj": item,
                "count": count,
            });

        else
            this._items[itemIndex].count += count;
    }

    /**
     * 
     * @param {Item} item 
     * @param {number} count 
     * @returns {number} Amound that could not be removed
     */
    tryRemoveItem(item, count) {

        item = this.itemToKey(item);

        const itemIndex = this._getItemIndex(item, 1);

        if (itemIndex != -1) {

            if (this._items[itemIndex].count - count < 0)
                return false;

            this._items[itemIndex].count -= count;
            return true;
        }
        else
            return false;
    }

    /**
     * @param {string} key Name of Item classm has to be converted to string
     * @returns -1 if not found, else index
     */
    _getItemIndex(key) {

        let i = 0;
        for (const itemObj of this._items) {

            if (itemObj.key == key)
                return i;

            i++;
        }

        return -1;
    }

    itemCount(item) {

        item = this.itemToKey(item);

        const itemIndex = this._getItemIndex(item, 1);

        if (itemIndex == -1)
            return 0;

        return this._items[itemIndex].count;
    }

    itemToKey(item){

        if(typeof item == "object")
            return item.constructor.name;
        else if (typeof item == "function")
            return item.name;
        else if (typeof item == "string")
            return item;
        else
            console.trace("item not found", item);
    }
}