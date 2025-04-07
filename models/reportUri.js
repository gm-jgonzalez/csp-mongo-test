const mongoose = require('mongoose');

const reportUriSchema = new mongoose.Schema({
    
  },
  {
    timestamps: true
  });

  reportUriSchema.methods.toJSON = function () {
    const { __v, _id, ...cspReport } = this.toObject();
    cspReport.id = _id;
    return cspReport;
  };
  
  module.exports = mongoose.model('ReportUri', reportUriSchema);