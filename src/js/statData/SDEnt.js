import StatData from "./StatData.js";

export default class SDEnt extends StatData {
    constructor(jsonData, jsonKey) {
        super();

        this.loadEmpty();

        if(jsonKey != null)
            this.parseJson(jsonData, jsonKey);
    }

    loadEmpty() {
        this._maxHp = 10;
        this._currHp = this._maxHp;
        this._baseHpRegen = 0;
        this._basePhArmor = 0;
        this._baseMaArmor = 0;
        this._basePhDmgScaler = 1;
        this._baseMaDmgScaler = 1;
        this._baseManaStorage = 0;
        this._baseManaRegen = 0;
        this._baseCooldownScaler = 1;
        this._baseInvurnableTime = 100;
        
        this._baseDodgeChance = 0;
        this._baseTenacity = 0;
        this._baseMoveSpeed = 100;

        // Bonus stats
        this._bonusHp = 0;
        this._bonusHpRegen = 0;
        this._bonusPhArmor = 0;
        this._bonusMaArmor = 0;
        this._bonusPhDmgScaler = 0;
        this._bonusMaDmgScaler = 0;
        this._bonusManaStorage = 0;
        this._bonusManaRegen = 0;
        this._bonusCooldownScaler = 0;
        this._bonusDodgeChance = 0;
        this._bonusTenacity = 0;
        this._bonusMoveSpeed = 0;
        this._bonusInvurnableTime = 0;
    }

    parseJson(json, key) {

        if(key == "")
            return;

        if (!json || !json[key]) {
            console.warn(`No data found for entity key: ${key}`);
            return;
        }

        const data = json[key];
        const baseValues = data.baseValues || {};

        // Load base values
        this._maxHp = baseValues.hp ?? this._maxHp;
        this._currHp = baseValues.hp ?? this._maxHp;
        this._baseHpRegen = baseValues.hp_regen ?? this._baseHpRegen;
        this._basePhArmor = baseValues.ph_armor ?? this._basePhArmor;
        this._baseMaArmor = baseValues.ma_armor ?? this._baseMaArmor;
        this._basePhDmgScaler = baseValues.ph_dmg_scaler ?? this._basePhDmgScaler;
        this._baseMaDmgScaler = baseValues.ma_dmg_scaler ?? this._baseMaDmgScaler;
        this._baseManaStorage = baseValues.mana_storage ?? this._baseManaStorage;
        this._baseManaRegen = baseValues.mana_regen ?? this._baseManaRegen;
        this._baseTenacity = baseValues.tenacity ?? this._baseTenacity;
        this._baseDodgeChance = baseValues.dodge_chance ?? this._baseDodgeChance;
        this._baseCooldownScaler = baseValues.cooldown_scaler ?? this._baseCooldownScaler;
        this._baseMoveSpeed = baseValues.move_speed ?? this._baseMoveSpeed;
        this._baseInvurnableTime = baseValues.invurnable_time ?? this._baseInvurnableTime;
    }

    getStatTypes() {
        return ["hp", "hpRegen", "phArmor", "maArmor", "phDmgScaler", "maDmgScaler", "manaStorage", "manaRegen", "tenacity", "dodgeChance", "cooldownScaler", "moveSpeed"];
    }

    getStat(stat) {
        return this[stat]();
    }

    getStatBonus(stat) {

        // let statName = stat.charAt(0).toUpperCase() + stat.slice(1);
        let statName = stat;
        let fullStatName = `${statName}`;

        console.log(fullStatName);

        return this[fullStatName];
    }

    setStatBonus(stat, value) {
        this[stat] = value;
    }

    // bonus hp is currently not used
    deltaHp(delta) {
        this._currHp += delta;
        this._currHp = Math.min(Math.max(this._currHp, 0), this._maxHp);
    }

    get maxHp() { return this._maxHp; }
    get hp() { return this._currHp + this._bonusHp; }
    get hpRegen() { return this._baseHpRegen + this._bonusHpRegen; }
    get phArmor() { return this._basePhArmor + this._bonusPhArmor; }
    get maArmor() { return this._baseMaArmor + this._bonusMaArmor; }
    get phDmgScaler() { return this._basePhDmgScaler + this._bonusPhDmgScaler; }
    get maDmgScaler() { return this._baseMaDmgScaler + this._bonusMaDmgScaler; }
    get manaStorage() { return this._baseManaStorage + this._bonusManaStorage; }
    get manaRegen() { return this._baseManaRegen + this._bonusManaRegen; }
    get tenacity() { return this._baseTenacity + this._bonusTenacity; }
    get dodgeChance() { return this._baseDodgeChance + this._bonusDodgeChance; }
    get cooldownScaler() { return this._baseCooldownScaler + this._bonusCooldownScaler; }
    get moveSpeed() { return this._baseMoveSpeed + this._bonusMoveSpeed; }
    get invurnableTime() { return this._baseInvurnableTime + this._bonusInvurnableTime; }

    set bonusHp(value) { this._bonusHp = value; }
    set bonusHpRegen(value) { this._bonusHpRegen = value; }
    set bonusPhArmor(value) { this._bonusPhArmor = value; }
    set bonusMaArmor(value) { this._bonusMaArmor = value; }
    set bonusPhDmgScaler(value) { this._bonusPhDmgScaler = value; }
    set bonusMaDmgScaler(value) { this._bonusMaDmgScaler = value; }
    set bonusManaStorage(value) { this._bonusManaStorage = value; }
    set bonusManaRegen(value) { this._bonusManaRegen = value; }
    set bonusTenacity(value) { this._bonusTenacity = value; }
    set bonusDodgeChance(value) { this._bonusDodgeChance = value; }
    set bonusCooldownScaler(value) { this._bonusCooldownScaler = value; }
    set bonusMoveSpeed(value) { this._bonusMoveSpeed = value; }
}