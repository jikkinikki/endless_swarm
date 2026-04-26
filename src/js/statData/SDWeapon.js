import StatData from "./StatData.js";
import SDEnt from "./SDEnt.js";

export default class SDWeapon extends StatData {

    /**
     * @param {import("../entities/Ent.js").default} owner 
     * @param {String} jsonKey 
     */
    constructor(jsonFile, jsonKey) {

        super();

        this.loadEmpty();
        this.parseJson(jsonFile, jsonKey);

        this._emptyEntData = new SDEnt("", null);
        this._lvl = 0;
    }

    /**
     * @param {import("../entities/Ent.js").default} owner 
     */
    setOwner(owner) {

        this._owner = owner;
    }

    levelUp() {

        if (this._lvl > this._levels.length - 1) {
            console.warn("cant go abovemax level");
            return;
        }

        this._lvl++;
    }

    setLevel(lvl) {

        if (lvl > this._levels.length - 1) {
            console.warn("cant go abovemax level");
            return;
        }

        this._lvl = lvl;
    }


    /**
     * @returns {SDEnt}
     */
    _getEntStatData() {

        if (this._owner)
            return this._owner._statData;

        return this._emptyEntData;
    }

    loadEmpty() {

        this._basePhDmg = 1;
        this._baseMaDmg = 1;
        this._baseHealing = 0;
        this._baseMoveSpeed = 10;
        this._baseLifeTime = 1000;
        this._baseCooldown = 2000;
        this._baseProjCount = 1;

        //-1 is infinite range
        this._baseRange = 1000;
        //-1 is for infinite targets
        this._basePenetration = -1;
        this._baseCanHitSame = true;

        this._levels = [];
        this._totLevels = 0;

        this._shop_data = {};
    }

    parseJson(json, key) {
        if (!json || !json[key]) {
            console.warn(`No data found for weapon key: ${key}`);
            return;
        }

        const data = json[key];
        const baseValues = data.baseValues || {};

        // Load base values
        this._basePhDmg = baseValues.ph_dmg ?? this._basePhDmg;
        this._baseMaDmg = baseValues.ma_dmg ?? this._baseMaDmg;
        this._baseHealing = baseValues.healing ?? this._baseHealing;
        this._baseMoveSpeed = baseValues.move_speed ?? this._baseMoveSpeed;
        this._baseLifeTime = baseValues.life_time ?? this._baseLifeTime;
        this._baseCooldown = baseValues.cooldown ?? this._baseCooldown;
        this._baseProjCount = baseValues.proj_count ?? this._baseProjCount;
        this._baseRange = baseValues.range ?? this._baseRange;
        this._basePenetration = baseValues.penetration ?? this._basePenetration;
        this._baseCanHitSame = baseValues.can_hit_same ?? this._baseCanHitSame;

        this._levels = data.levels || [];
        this._totLevels = this._levels ? this._levels.length : 0;
        this._shop_data = data.shop_data || [];
    }

    getLevelScaler(statName, deltaLvl = 0) {
        
        
        const level = this._lvl + deltaLvl;
        const levelData = this._levels[level];
        
        if(level < 0)
            return 1;

        if (levelData?.[statName])
            return levelData?.[statName];

        return this.getLevelScaler(statName, deltaLvl - 1);
    }

    // Getters that apply level scalers and entity scalers
    get phDmg() {
        return this._basePhDmg * this.getLevelScaler('ph_dmg') * this._getEntStatData().phDmgScaler;
    }
    get maDmg() {
        return this._baseMaDmg * this.getLevelScaler('ma_dmg') * this._getEntStatData().maDmgScaler;
    }
    get healing() {
        return this._baseHealing * this.getLevelScaler('healing');
    }
    get moveSpeed() {
        // console.log(this._baseMoveSpeed, this.getLevelScaler('move_speed'));

        return this._baseMoveSpeed * this.getLevelScaler('move_speed');
    }
    get lifeTime() {
        return this._baseLifeTime * this.getLevelScaler('life_time');
    }
    get cooldown() {
        return this._baseCooldown * this.getLevelScaler('cooldown') * this._getEntStatData().cooldownScaler;
    }
    get projCount() {
        return this._baseProjCount * this.getLevelScaler('proj_count');
    }
    get range() {
        return this._baseRange * this.getLevelScaler('range');
    }
    get penetration() {
        return this._basePenetration * this.getLevelScaler('penetration');
    }
    get canHitSame() {
        return this._baseCanHitSame;
    }

    getAttack() {


    }
}
