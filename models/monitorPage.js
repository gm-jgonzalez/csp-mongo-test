const mongoose = require('mongoose');

const monitorPageSchema = new mongoose.Schema({
    clientId: String,
    baseUrl: String,
    name: String,
    description: String,
    normalizedUrls: [String],
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active'
    },
    notificationEmails: [String],
  },
  {
    timestamps: true
  });

  monitorPageSchema.methods.toJSON = function () {
    const { __v, _id, ...monitorPage } = this.toObject();
    monitorPage.id = _id;
    return monitorPage;
  };
  
  module.exports = mongoose.model('MonitorPage', monitorPageSchema);