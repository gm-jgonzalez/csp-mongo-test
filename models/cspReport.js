const mongoose = require('mongoose');

const cspReportSchema = new mongoose.Schema({
    clientId: String,
    domain: String,
    documentUri: String,
    referrer: String,
    blockedUri: String,
    violatedDirective: String,
    effectiveDirective: String,
    originalPolicy: String,
    sourceFile: String,
    statusCode: Number,
    lineNumber: Number,
    columnNumber: Number,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    reportToken: String
  });

  cspReportSchema.methods.toJSON = function () {
    const { __v, _id, ...cspReport } = this.toObject();
    cspReport.id = _id;
    return cspReport;
  };
  
  export const CspReport = model('CspReport', cspReportSchema);