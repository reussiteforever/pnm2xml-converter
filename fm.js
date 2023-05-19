/**
 * USEFUL LINKS : 
 * 1.https://blog.logrocket.com/running-node-js-scripts-continuously-forever/
 */
const forever = require('forever-monitor');

const child = new forever.Monitor('./src/js/server.js', {
  max: 3,
  silent: false,
  uid: 'server',
});

child.on('exit', function () {
  console.log('app.js has exited after 3 restarts');
});

child.start(); 