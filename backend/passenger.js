const path = require('path');

// Phusion Passenger entry point
// This file delegates to server.js which handles the environment detection
// and loads the compiled application from dist/main.js

require('./server.js');
