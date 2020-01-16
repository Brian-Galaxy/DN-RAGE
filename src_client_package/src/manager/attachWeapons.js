mp.events.add("registerWeaponAttachments", (json) => {
    try {
        let data = JSON.parse(json);
        for (let weapon in data)
            mp.attachmentMngr.register(data[weapon].AttachName, data[weapon].AttachModel, data[weapon].AttachBone, data[weapon].AttachPosition, data[weapon].AttachRotation);
    }
    catch (e) {
        console.log(e);
    }
});