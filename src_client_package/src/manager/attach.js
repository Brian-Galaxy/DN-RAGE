import methods from '../modules/methods';
import attachItems from "./attachItems";

let attach = {};

mp.attachmentMngr =
    {
        attachments: {},

        addFor: function(entity, id)
        {
            try {
                if(this.attachments.hasOwnProperty(id))
                {
                    if(!entity.__attachmentObjects.hasOwnProperty(id))
                    {
                        let attInfo = this.attachments[id];

                        let object = mp.objects.new(attInfo.model, entity.position);

                        object.attachTo(entity.handle,
                            (typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName),
                            attInfo.offset.x, attInfo.offset.y, attInfo.offset.z,
                            attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z,
                            false, false, false, false, 2, true);

                        entity.__attachmentObjects[id] = object;
                    }
                }
                else
                {
                    methods.debug(`Static Attachments Error: Unknown Attachment Used: ~w~0x${id.toString(16)}`);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        removeFor: function(entity, id)
        {
            try {
                if(entity.__attachmentObjects.hasOwnProperty(id))
                {
                    let obj = entity.__attachmentObjects[id];
                    delete entity.__attachmentObjects[id];

                    if(mp.objects.exists(obj))
                    {
                        obj.destroy();
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        initFor: function(entity)
        {
            try {
                for(let attachment of entity.__attachments)
                {
                    mp.attachmentMngr.addFor(entity, attachment);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        shutdownFor: function(entity)
        {
            try {
                for(let attachment in entity.__attachmentObjects)
                {
                    mp.attachmentMngr.removeFor(entity, attachment);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        register: function(id, model, boneName, offset, rotation)
        {
            return;
            try {
                if(typeof(id) === 'string')
                {
                    id = mp.game.joaat(id);
                }

                if(typeof(model) === 'string')
                {
                    model = mp.game.joaat(model);
                }

                if(!this.attachments.hasOwnProperty(id))
                {
                    if(mp.game.streaming.isModelInCdimage(model))
                    {
                        this.attachments[id] =
                            {
                                id: id,
                                model: model,
                                offset: offset,
                                rotation: rotation,
                                boneName: boneName
                            };
                    }
                    else
                    {
                        methods.debug(`Static Attachments Error: Invalid Model (0x${model.toString(16)})`);
                    }
                }
                else
                {
                    methods.debug("Static Attachments Error: Duplicate Entry");
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        unregister: function(id)
        {
            try {
                if(typeof(id) === 'string')
                {
                    id = mp.game.joaat(id);
                }

                if(this.attachments.hasOwnProperty(id))
                {
                    this.attachments[id] = undefined;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        addLocal: function(attachmentName)
        {
            try {
                if(typeof(attachmentName) === 'string')
                {
                    attachmentName = mp.game.joaat(attachmentName);
                }

                let entity = mp.players.local;

                if(!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1)
                {
                    mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        removeLocal: function(attachmentName)
        {
            try {
                if(typeof(attachmentName) === 'string')
                {
                    attachmentName = mp.game.joaat(attachmentName);
                }

                let entity = mp.players.local;

                if(entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1)
                {
                    mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        getAttachments: function()
        {
            return Object.assign({}, this.attachments);
        }
    };

mp.events.add("entityStreamIn", (entity) =>
{
    try {
        if(entity.__attachments)
        {
            mp.attachmentMngr.initFor(entity);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("entityStreamOut", (entity) =>
{
    try {
        if(entity.__attachmentObjects)
        {
            mp.attachmentMngr.shutdownFor(entity);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addDataHandler("attachmentsData", (entity, data) =>
{
    try {
        let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];

        if(entity.handle !== 0)
        {
            let oldAttachments = entity.__attachments;

            if(!oldAttachments)
            {
                oldAttachments = [];
                entity.__attachmentObjects = {};
            }

            // process outdated first
            for(let attachment of oldAttachments)
            {
                if(newAttachments.indexOf(attachment) === -1)
                {
                    mp.attachmentMngr.removeFor(entity, attachment);
                }
            }

            // then new attachments
            for(let attachment of newAttachments)
            {
                if(oldAttachments.indexOf(attachment) === -1)
                {
                    mp.attachmentMngr.addFor(entity, attachment);
                }
            }
        }

        entity.__attachments = newAttachments;
    }
    catch (e) {
        methods.debug(e);
    }
});

attach.init = function () {
    try {
        mp.players.forEach(_player =>
        {
            try {
                let data = _player.getVariable("attachmentsData");

                if(data && data.length > 0)
                {
                    let atts = data.split('|').map(att => parseInt(att, 36));
                    _player.__attachments = atts;
                    _player.__attachmentObjects = {};
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

export default attach;