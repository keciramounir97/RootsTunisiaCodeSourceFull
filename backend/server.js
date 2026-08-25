/**
 * ROOTS MAGHREB - PRODUCTION ENTRY POINT (cPanel / Phusion Passenger)
 */

// Passenger provides the PORT environment variable automatically.
// Our NestJS app is configured to listen on process.env.PORT in main.ts.

// We import the compiled main file.
// If your build structure is different, adjust this path.
require('./dist/main.js');
