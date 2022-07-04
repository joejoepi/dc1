/*
WRITTEN BY Douile & Roque
https://github.com/Douile/
https://github.com/RoqueDEV/
*/

/*
Environment setup
Set environment variables as described below:
  http://144.91.92.162:40640 - base url for fiveM server e.g. http://127.0.0.1:3501
  LOG_LEVEL - Int of enum 0-4 specifying level of logs to display with 4 as no logs
  Nzg3NzY4MjUwMzk3MjI5MTA2.X9ZwWg.5YXdFSO-jwtKkJ7ZRpnrS120B5c - Discord bot token
  749365004184190998 - channel id for updates to be pushed to
  787774033353637898 - message id of previous update to edit (not required)
  773567642291798066 - channel to create suggestion embeds in
  749365017555763285 - channel to recieve bug reports
  749365017555763285 - channel to log bug reports
  749365074266947654 - channel to log status changes
*/

const setup = require('./setup.js');
const { start } = require('./bot.js');

const printValues = function(values,text) {
  console.log(text ? text : 'Current values:');
  for (var key in values) {
    console.log(`  ${key} = \x1b[32m'${values[key]}'\x1b[0m`);
  }
}

const startBot = function(values) {
  console.log('Starting bot');
  var bot = start(values);
  bot.on('restart',() => {
    console.log('\nRestarting bot');
    bot.destroy();
    bot = start(values);
  })
  var shutdown = function() {
    console.log('Shutting down');
    let destructor = bot.destroy();
    if (destructor) {
      destructor.then(() => {
        process.exit(0);
      }).catch(console.error);
    } else {
      process.exit(0);
    }
  }
  process.on('SIGINT',shutdown);
  process.on('SIGTERM',shutdown);
}

if (process.argv.includes('-c') || process.argv.includes('--config')) {
  setup.loadValues().then((values) => {
    printValues(values);
    process.exit(0);
  }).catch((error) => {
    console.log('Unable to load saved values, configuring all again');
    setup.createValues().then((values) => {
      setup.saveValues(values).then(() => {
        printValues(values,'New values:');
        process.exit(0);
      }).catch(console.error);
    }).catch(console.error);
  })
} else {
  console.log('Attempting to load enviroment');
  setup.loadValues().then((values) => {
    startBot(values);
  }).catch((error) => {
    console.error(error);
    setup.createValues().then((values) => {
      setup.saveValues(values).then(() => {
        startBot(values);
      }).catch(console.error);
    }).catch(console.error);
  })
}