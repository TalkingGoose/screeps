'use strict';

const constants = require('constants');

Memory.spawnQueue = [];
Memory.pendingSpawns = {};

const Managers = {
    'harvesters': require('managers.harvester'),
    'upgraders': require('managers.upgrader'),
    'builders': require('managers.builder'),
    'spawning': require('managers.spawning')
};

Memory.managers = Managers;

module.exports = {
    'loop': function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let spawn = Game.spawns.Spawn1;
        Memory.cache = {
            'sources': spawn.room.find(FIND_SOURCES),
            'structures': spawn.room.find(FIND_STRUCTURES, structure => structure.my),
            'construction': spawn.room.find(FIND_CONSTRUCTION_SITES)
        };

        Memory.cache.repairable = [];
        Memory.cache.energy = [];

        Memory.cache.energyStorage = _.reduce(Memory.cache.structures, (total, structure) => {
            if (structure.hits < structure.hitsMax) {
                Memory.cache.repairable.push(structure);
            }

            if (!constants.ENERGY_STORES.includes(structure.structureType)) {
                return total;
            }

            switch (structure.structureType) {
                case STRUCTURE_CONTAINER:
                    if (structure.store.energy < structure.storeCapacity) {
                        total[total.length] = structure;
                    }

                    Memory.cache.energy.unshift(structure);
                    break;

                default:
                    if (structure.energy < structure.energyCapacity) {
                        total.unshift(structure);
                    } else if (Memory.spawnQueue.length === 0) {
                        Memory.cache.energy.push(structure);
                    }
                    break;
            }

            return total;
        }, []);

        let creeps = _.groupBy(Game.creeps, creep => creep.memory.role);
        _.each(Managers, manager => manager.tick(creeps));
    }
};
