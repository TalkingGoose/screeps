'use strict';

const constants = require('constants');

const util = require('libs.util');

const pendingSpawns = Memory.pendingSpawns;

function UpgraderManager() {
    if (!(this instanceof UpgraderManager)) {
        return new UpgraderManager();
    }

    UpgraderManager.super_.call(this);

    this.role = 'upgrader';
    this.creeps = [];
    pendingSpawns[this.role] = 0;

    return this;
}

util.inherits(UpgraderManager, Object);
Object.defineProperties(UpgraderManager.prototype, {
    'tick': {
        'value': function(creeps) {
            this.creeps = (creeps[this.role] || []);

            if ((this.creeps.length + pendingSpawns[this.role]) < constants.UPGRADERS.MIN) {
                this.spawn();
            }

            _.each(this.creeps, creep => this.think(creep, creep.memory));
        }
    },

    'spawn': {
        'value': function() {
            pendingSpawns[this.role]++;

            Memory.spawnQueue.push({
                'priority': 2,
                'data': [constants.UPGRADERS.BODY, null, {'role': this.role, 'task': 'withdraw'}],
                'type': this.role
            });
        }
    },

    'think': {
        'value': function(creep, memory) {
            if (memory.task === 'withdraw') {
                if (creep.carry.energy === creep.carryCapacity) {
                    memory.task = 'upgrade';
                    return;
                }

                if (Memory.cache.energy.length > 0) {
                    let stores = _.sortBy(Memory.cache.energy, structure => util.distance(structure, creep));
                    if (creep.withdraw(stores[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(stores[0]);
                    }
                }
            }

            if (memory.task === 'upgrade') {
                if (creep.carry.energy === 0) {
                    memory.task = 'withdraw';
                    return;
                }

                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
});

module.exports = new UpgraderManager();
