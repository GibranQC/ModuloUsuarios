var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HospitalModel = new Schema({
    clue: {
        type: String,
        uppercase: true
    },
    /**Código del hospital**/
    name: {
        type: String,
        uppercase: true
    },
    numberHospital: {
        type: String
    },
    /**Nombre del hospital**/
    concentrateCreate: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number
    },
    institution: {
        _id: {
            type: String
        },
        name: {
            type: String,
            uppercase: true
        }
    },
    project: {
        _id: {
            type: String
        },
        state: {
            type: String,
            uppercase: true
        }
    },
    day: {
        _id: {
            type: String
        },
        name: {
            type: String,
            uppercase: true
        }
    },
    concentrated: {
        type: Schema.Types.ObjectId,
        ref: 'periods'
    },
    stockControls: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'supplies'
        },
        minimum: {
            type: Number
        },
        maximum: {
            type: Number
        },
        latency: {
            type: Number
        }
    }],
    cie10: {
        type: Boolean,
        default: true
    },
    cie9: {
        type: Boolean,
        default: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    doctors: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'doctors'
        }
    }],
    roomsQx: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'rooms'
        }
    }]
});

module.exports = mongoose.model('Hospital', HospitalModel);