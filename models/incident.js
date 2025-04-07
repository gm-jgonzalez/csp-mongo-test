const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    pageId: mongoose.Schema.Types.ObjectId,
    documentUri: String,
    blockedResource: String,
    violatedDirective: String,
    effectiveDirective: String,
    attackType: {
      type: String,
      enum: ['XSS', 'Data Injection', 'Other'],
    },
    attackDescription: String,
    violationHash: { type: String, index: true },
    occurrenceCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['new', 'notified', 'acknowledged', 'resolved', 'ignored'],
      default: 'new'
    },
    lastNotified: Date,
    notificationCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  });

  incidentSchema.methods.toJSON = function () {
    const { __v, _id, ...incident } = this.toObject();
    incident.id = _id;
    return incident;
  };
  
  module.exports = mongoose.model('Incident', incidentSchema);