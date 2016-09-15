'use strict';

module.exports = {
    'inherits': function(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            'constructor': {
                'value': ctor,
                'enumerable': false,
                'writable': true,
                'configurable': true
            }
        });
    },

    'distance': function(entityA, entityB) {
        return Math.abs(entityB.pos.x - entityA.pos.x) + Math.abs(entityB.pos.y - entityA.pos.y);
    },

    'getSpawnEnergyCapacity': function() {
        return _.reduce(Memory.cache.structures, (total, structure) => {
            if ([STRUCTURE_EXTENSION, STRUCTURE_SPAWN].includes(structure.structureType)) {
                total += structure.energyCapacity;
            }

            return total;
        }, 0);
    },

    'getSpawnEnergy': function() {
        return _.reduce(Memory.cache.structures, (total, structure) => {
            if ([STRUCTURE_EXTENSION, STRUCTURE_SPAWN].includes(structure.structureType)) {
                total += structure.energy;
            }

            return total;
        }, 0);
    }
};
