'use strict';

const constants = require('constants');

const util = require('libs.util');

const pendingSpawns = Memory.pendingSpawns;

function SpawningManager() {
    if (!(this instanceof SpawningManager)) {
        return new SpawningManager();
    }

    SpawningManager.super_.call(this);

    return this;
}

util.inherits(SpawningManager, Object);
Object.defineProperties(SpawningManager.prototype, {
    'tick': {
        'value': function() {
            let spawner = Game.spawns.Spawn1;
            if (Memory.spawnQueue.length > 0 && spawner.spawning === null) {
                this.spawn();
            }
        }
    },

    'spawn': {
        'value': function() {
            let spawner = Game.spawns.Spawn1;
            let queue = (Memory.spawnQueue = _.sortBy(Memory.spawnQueue, spawn => -spawn.priority));

            const toSpawn = queue[0];
            const error = spawner.canCreateCreep(...toSpawn.data);
            if (error === OK) {
                pendingSpawns[toSpawn.type]--;
                let name = spawner.createCreep(...toSpawn.data);

                if (_.isString(name)) {
                    Memory.creeps[name].name = name; // REMEMBER UR NAME!
                }

                Memory.spawnQueue = queue.slice(1);
            } else {
                console.log(error);
            }
        }
    }
});

module.exports = new SpawningManager();
