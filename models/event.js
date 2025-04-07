const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    incidentId: mongoose.Schema.Types.ObjectId,
    sourceFile: String,
    statusCode: Number,
    lineNumber: Number,
    columnNumber: Number,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    originalReport: {
      type: mongoose.Schema.Types.Mixed,
      required: true, // Optional: Add validation if it's required
    },
    disposition: {
      type: String,
      enum: ['Enforced', 'Report'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high','critical'],
      default: 'critical'
    },
  },
  {
    timestamps: true
  });

  eventSchema.methods.toJSON = function () {
    const { __v, _id, ...event } = this.toObject();
    event.id = _id;
    return event;
  };
  
  module.exports = mongoose.model('Event', eventSchema);