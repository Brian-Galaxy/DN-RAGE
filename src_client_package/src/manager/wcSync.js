import methods from "../modules/methods";

const Natives = {
    GIVE_WEAPON_COMPONENT_TO_PED: "0xD966D51AA5B28BB9",
    REMOVE_WEAPON_COMPONENT_FROM_PED: "0x1E8BE90C74FB4C09",
    SET_CURRENT_PED_WEAPON: "0xADF692B254977C0C",
    SET_PED_WEAPON_TINT_INDEX: "0x50969B9B89ED5738"
};

let wcSync = {};

function addComponentToPlayer(player, weaponHash, componentHash) {
    if (!player.hasOwnProperty("__weaponComponentData")) player.__weaponComponentData = {};
    if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) player.__weaponComponentData[weaponHash] = new Set();

    player.__weaponComponentData[weaponHash].add(componentHash);
    mp.game.invoke(Natives.GIVE_WEAPON_COMPONENT_TO_PED, player.handle, weaponHash, componentHash);
}

function removeComponentFromPlayer(player, weaponHash, componentHash) {
    if (!player.hasOwnProperty("__weaponComponentData")) player.__weaponComponentData = {};
    if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) player.__weaponComponentData[weaponHash] = new Set();

    player.__weaponComponentData[weaponHash].delete(componentHash);
    mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weaponHash, componentHash);
}

mp.events.add("updatePlayerWeaponComponent", (player, weaponHash, componentHash, removeComponent) => {
    weaponHash = parseInt(weaponHash, 36);
    componentHash = parseInt(componentHash, 36);

    if (removeComponent) {
        removeComponentFromPlayer(player, weaponHash, componentHash);
    } else {
        addComponentToPlayer(player, weaponHash, componentHash);
    }
});

mp.events.add("resetPlayerWeaponComponents", (player, weaponHash) => {
    if (!player.hasOwnProperty("__weaponComponentData")) return;
    if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) return;

    weaponHash = parseInt(weaponHash, 36);

    for (let component of player.__weaponComponentData[weaponHash]) mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weaponHash, componentHash);
    player.__weaponComponentData[weaponHash].clear();
});

mp.events.add("nukePlayerWeaponComponents", (player) => {
    if (!player.hasOwnProperty("__weaponComponentData")) return;

    for (let weapon in player.__weaponComponentData) {
        for (let component of player.__weaponComponentData[weapon]) mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weapon, component);
    }

    player.__weaponComponentData = {};
});

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") {
        let data = entity.getVariable("currentWeaponComponents");

        if (data) {
            let [weaponHash, components] = data.split(".");
            weaponHash = parseInt(weaponHash, 36);
            let componentsArray = (components && components.length > 0) ? components.split('|').map(hash => parseInt(hash, 36)) : [];

            // don't touch this or you will have a bad time
            entity.giveWeapon(weaponHash, -1, true);
            for (let component of componentsArray) addComponentToPlayer(entity, weaponHash, component);
            mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, true);
        }

        let data2 = entity.getVariable("currentWeaponTint");

        if (data2) {
            let [weaponHash, tintIndex] = data2.split("|");
            weaponHash = parseInt(weaponHash, 36);

            entity.giveWeapon(weaponHash, -1, true);
            mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash, tintIndex);
            mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, tintIndex);
        }
    }
});

mp.events.add("entityStreamOut", (entity) => {
    if (entity.type === "player" && entity.hasOwnProperty("__weaponComponentData")) entity.__weaponComponentData = {};
});

mp.events.addDataHandler("currentWeaponComponents", (entity, value) => {
    if (entity.type === "player" && entity.handle !== 0) {
        if (!entity.hasOwnProperty("__weaponComponentData")) entity.__weaponComponentData = {};

        let [weaponHash, components] = value.split(".");
        weaponHash = parseInt(weaponHash, 36);

        if (!entity.__weaponComponentData.hasOwnProperty(weaponHash)) entity.__weaponComponentData[weaponHash] = new Set();

        let currentComponents = entity.__weaponComponentData[weaponHash];
        let newComponents = (components && components.length > 0) ? components.split('|').map(hash => parseInt(hash, 36)) : [];

        for (let component of currentComponents) {
            if (!newComponents.includes(component)) removeComponentFromPlayer(entity, weaponHash, component);
        }

        for (let component of newComponents) addComponentToPlayer(entity, weaponHash, component);
        mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, true);

        entity.__weaponComponentData[weaponHash] = new Set(newComponents);
    }
});

mp.events.addDataHandler("currentWeaponTint", (entity, value) => {
    if (entity.type === "player" && entity.handle !== 0) {
        let [weaponHash, tintIndex] = value.split("|");
        weaponHash = parseInt(weaponHash, 36);

        mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash >> 0, tintIndex >> 0);
    }
});

export default wcSync;