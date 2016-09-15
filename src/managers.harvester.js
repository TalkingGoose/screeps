'use strict';

const constants = require('constants');

const util = require('libs.util');

const pendingSpawns = Memory.pendingSpawns;

function HarvesterManager() {
    if (!(this instanceof HarvesterManager)) {
        return new HarvesterManager();
    }

    HarvesterManager.super_.call(this);

    this.role = 'harvester';
    this.creeps = [];
    pendingSpawns[this.role] = 0;

    return this;
}

util.inherits(HarvesterManager, Object);
Object.defineProperties(HarvesterManager.prototype, {
    'tick': {
        'value': function(creeps) {
            this.creeps = (creeps[this.role] || []);

            if ((this.creeps.length + pendingSpawns[this.role]) < constants.HARVESTERS.MIN) {
                this.spawn();
            }

            _.each(this.creeps, creep => this.think(creep, creep.memory));
        }
    },

    'spawn': {
        'value': function() {
            pendingSpawns[this.role]++;

            Memory.spawnQueue.push({
                'priority': 99,
                'data': [constants.HARVESTERS.BODY, null, {'role': this.role, 'task': 'harvest'}],
                'type': this.role
            });
        }
    },

    'think': {
        'value': function(creep, memory) {
            if (memory.task === 'harvest') {
                if (creep.carry.energy === creep.carryCapacity) {
                    memory.task = 'deposit';
                    return;
                }

                let sources = _.sortBy(Memory.cache.sources, source => util.distance(source, creep));

                const length = sources.length;
                let error;
                for (let i = 0; i < length; ++i) {
                    error = creep.harvest(sources[i]);

                    if (error === OK) {
                        break;
                    }

                    if (error === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[i]);
                        break;
                    }
                }
            }

            if (memory.task === 'deposit') {
                if (creep.carry.energy === 0) {
                    memory.task = 'harvest';
                    return;
                }

                const targets = Memory.cache.energyStorage;
                if (targets.length === 0) {
                    let spawn = Game.spawns.Spawn1;
                    if (util.distance(spawn, creep) > 8) {
                        creep.moveTo(spawn);
                    }
                } else {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }

        }
    }
});

module.exports = new HarvesterManager();
