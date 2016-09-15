'use strict';

const constants = require('constants');

const util = require('libs.util');

const pendingSpawns = Memory.pendingSpawns;

function BuilderManager() {
    if (!(this instanceof BuilderManager)) {
        return new BuilderManager();
    }

    BuilderManager.super_.call(this);

    this.role = 'builder';
    this.creeps = [];

    pendingSpawns[this.role] = 0;

    return this;
}

util.inherits(BuilderManager, Object);
Object.defineProperties(BuilderManager.prototype, {
    'tick': {
        'value': function(creeps) {
            this.creeps = (creeps[this.role] || []);

            if ((this.creeps.length + pendingSpawns[this.role]) < constants.BUILDERS.MIN) {
                this.spawn();
            }

            _.each(this.creeps, creep => this.think(creep, creep.memory));
        }
    },

    'spawn': {
        'value': function() {
            pendingSpawns[this.role]++;

            Memory.spawnQueue.push({
                'priority': 1,
                'data': [constants.BUILDERS.BODY, null, {'role': this.role, 'task': 'withdraw'}],
                'type': this.role
            });
        }
    },

    'think': {
        'value': function(creep, memory) {
            if (memory.task === 'withdraw') {
                if (creep.carry.energy === creep.carryCapacity) {
                    memory.task = 'build';
                    return;
                }

                if (Memory.cache.energy.length > 0) {
                    let stores = _.sortBy(Memory.cache.energy, structure => util.distance(structure, creep));
                    if (creep.withdraw(stores[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(stores[0]);
                    }
                }
            }

            if (memory.task === 'build') {
                if (creep.carry.energy === 0) {
                    memory.task = 'withdraw';
                    return;
                }

                if (Memory.cache.repairable.length > 0) {
                    let structures = _.sortBy(Memory.cache.repairable, structure => util.distance(structure, creep));

                    if (creep.repair(structures[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structures[0]);
                    }
                } else if (Memory.cache.construction.length > 0) {
                    let structures = _.sortBy(Memory.cache.construction, structure => util.distance(structure, creep));

                    if (creep.build(structures[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structures[0]);
                    }
                } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
});

module.exports = new BuilderManager();
