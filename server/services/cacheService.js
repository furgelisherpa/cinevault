const NodeCache = require('node-cache');

// Standard TTL: 6 hours (21600 seconds)
// Check period: 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

module.exports = cache;
