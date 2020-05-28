const { statSync } = require('fs');

module.exports = function(main, dataMap, peerid, p) {
  let type = dataMap.get('action');
  let files = main.actions.filter(file => file.endsWith('.js') && statSync(`${__dirname}/actions/${file}`).isFile() && file.split('.')[0] === type);

  if (files.length < 1) {
    return console.log(`Unhandled action: ${type}`)
  }

  (require(`${__dirname}/actions/${files[0]}`))(main, dataMap, peerid, p);
};
