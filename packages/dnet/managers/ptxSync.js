let particles = new Map();

let ptxSync = exports;

ptxSync.has = (id) => {
    return particles.has(id);
};

ptxSync.get = (id) => {
    return particles.get(id);
};

ptxSync.set = (id, value) => {
    return particles.set(id, value);
};

ptxSync.toArray = () => {
    let arr = [];
    particles.forEach((v, k) => {
        arr.push({ id: k, ...v });
    });
    return arr;
};

ptxSync.destroy = (id) => {
    if(!particles.has(id)) return console.error('ptxSync: tried to destroy invalid id');

    particles.delete(id);
    mp.players.call('particleFx:destroy', [id]);
    return true;
};

ptxSync.addLoopedAtCoord = (id, fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis, options = { dimension: 0 }) => {
    if(particles.has(id)) return console.error('particleFx: tried to add existing id');

    const fx = {
        fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis,
        dimension: options.dimension,
        destroy: () => this.destroy(id)
    };

    particles.set(id, fx);
    mp.players.call('particleFx:add', [id, { fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis, dimension: options.dimension }]);
    return fx;
};

ptxSync.addLoopedOnEntity = (id, entity, fxName, effectName, offset, rotation, scale, xAxis, yAxis, zAxis, options = { dimension: 0 }) => {
    if(particles.has(id)) return console.error('particleFx: tried to add existing id');

    const fx = {
        entity: { remoteId: entity.id, type: entity.type },
        fxName, effectName, offset, rotation, scale, xAxis, yAxis, zAxis,
        dimension: options.dimension,
        destroy: () => this.destroy(id)
    };

    particles.set(id, fx);
    mp.players.call('particleFx:add', [id, { entity: { remoteId: entity.id, type: entity.type }, fxName, effectName, offset, rotation, scale, xAxis, yAxis, zAxis, dimension: options.dimension}]);
    return fx;
};

mp.Player.prototype.startParticleFxLoopedAtCoord = function (id, fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis) {
    this.call('client.start.particle.fx.lopped.at.coord', [id, fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis]);
};

mp.Player.prototype.startParticleFxLoopedOnEntity = function (id, entity, fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis) {
    this.call('client.particle.fx.lopped.on.entity', [id, entity, fxName, effectName, position, rotation, scale, xAxis, yAxis, zAxis]);
};

mp.Player.prototype.stopParticleFx = function (id) {
    this.call('client.stop.particle.fx.lopped', [id]);
};

// FX Money Rain
/*mp.events.addCommand({
    'fx_moneyrain' : (player) => {
        const
            id = 'moneyrain',
            fxName = 'scr_xs_celebration',
            effectName = 'scr_xs_money_rain_celeb',
            offset = { x: 0.0, y: 0.0, z: 1.25 },
            rotation = { x: 0, y: 0, z: 0 },
            scale = 1.25,
            xAxis = true,
            yAxis = true,
            zAxis = true
        ;

        const fx = ptxSync.addLoopedOnEntity(id, player, fxName, effectName, offset, rotation, scale, xAxis, yAxis, zAxis);
        setTimeout(() => fx.destroy(), 9000);
    }
});*/