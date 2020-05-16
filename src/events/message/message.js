const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
      console.log("In the message event");
      client.emit('directMessage', message);
      return;
    }

    const [cmdName, ...cmdArgs] = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/\s+/);
    const command = client.commands.get(cmdName);
    if (command) {
      command.run(client, message, cmdArgs);
    }
  }
}