'use strict';

const util = require('libs.util');

const HARVESTERS = {
    'MIN': 10
};

Object.defineProperties(HARVESTERS, {
    'BODY': {
        'get': function() {
            let availableEnergy = util.getSpawnEnergyCapacity();
            let harvesters = _.filter(Memory.creeps, creep => (creep.role === 'harvester'));

            if (harvesters.length > 0) {
                if (availableEnergy >= 350 && availableEnergy < 400) {
                    return [WORK, WORK, CARRY, MOVE, MOVE];
                }

                if (availableEnergy >= 400 && availableEnergy < 450) {
                    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                }

                if (availableEnergy >= 450 && availableEnergy < 500) {
                    return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                }

                if (availableEnergy >= 500) {
                    return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                }
            }

            return [WORK, WORK, CARRY, MOVE];
        }
    }
});

const UPGRADERS = {
    'MIN': 1
};

Object.defineProperties(UPGRADERS, {
    'BODY': {
        'get': function() {
            let availableEnergy = util.getSpawnEnergyCapacity();
            let harvesters = _.filter(Memory.creeps, creep => (creep.role === 'harvester'));

            if (harvesters.length > 0) {
                if (availableEnergy >= 350 && availableEnergy < 400) {
                    return [WORK, WORK, CARRY, CARRY, MOVE];
                }

                if (availableEnergy >= 400 && availableEnergy < 450) {
                    return [WORK, WORK, CARRY, CARRY, CARRY, MOVE];
                }

                if (availableEnergy >= 450) {
                    return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                }
            }

            return [WORK, CARRY, CARRY, MOVE];
        }
    }
});

const BUILDERS = {
    'MIN': 2
};

Object.defineProperties(BUILDERS, {
    'BODY': {
        'get': function() {
            let availableEnergy = util.getSpawnEnergyCapacity();
            let harvesters = _.filter(Memory.creeps, creep => (creep.role === 'harvester'));

            if (harvesters.length > 0) {
                if (availableEnergy >= 350 && availableEnergy < 400) {
                    return [WORK, WORK, CARRY, CARRY, MOVE];
                }

                if (availableEnergy >= 400 && availableEnergy < 450) {
                    return [WORK, WORK, CARRY, CARRY, CARRY, MOVE];
                }

                if (availableEnergy >= 450) {
                    return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
                }
            }

            return [WORK, CARRY, CARRY, MOVE];
        }
    }
});

const ENERGY_STORES = [
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
    STRUCTURE_CONTAINER
];

module.exports = {
    HARVESTERS,
    UPGRADERS,
    BUILDERS,
    ENERGY_STORES
};
