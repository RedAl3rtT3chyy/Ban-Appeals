const BaseEvent = require('../../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js')
const appealsChannel = "710908447712870400";
const openedAppeals = new Map();
const appealAccept = "711192887072784436";
const appealReject = "711192912951640075";

module.exports = class DirectMessageEvent extends BaseEvent {
  constructor() {
    super('directMessage');
  }
  
  async run(client, message) {
    console.log('Inside DM event')
    if(!openedAppeals.has(message.author.id)) {
        message.channel.send("Thank you for appealing! Your appeal has been processed and an Appeal Handler should contact you soon! Please be patient!")
        openedAppeals.set(message.author.id, message.guild)
        const channel = client.channels.cache.get(appealsChannel)
        if (channel) {
            const embed = new MessageEmbed()
            .setTitle("New Ban Appeal")
            .setColor(0xFF0000)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content);
            const msg = await channel.send(embed);
            await msg.react(appealAccept)
            await msg.react(appealReject)

            try {
                const reactionFilter = (reaction, user) => [appealAccept, appealReject].includes(reaction.emoji.id) && !user.
                bot;
                const reactions = await msg.awaitReactions(reactionFilter, { max: 1 }
                );
                const choice = reactions.get(appealAccept) || reactions.get(appealReject);
                if(choice.emoji.id == appealAccept) {
                    message.author.send("Your appeal has been accepted. You should recieve an invite back into the main server by an Appeal Handler momentarily. Thank you for appealing.")
                    setTimeout(() => {
                        openedAppeals.delete(message.author.id);
                    }, 30000);
                } else if (choice.emoji.id == appealReject) {
                    message.author.send("Your appeal was denied. You should recieve a message by an Appeal Handler shortly specifying a reason for this. You may try again in 30 minutes. unless told otherwise by an appeal handler.");
                    setTimeout(() => {
                        openedAppeals.delete(message.author.id);
                    }, 30000);
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            message.channel.send("Uh oh! Something went wrong. Contact an Appeal Handler directly and try again later.")
            openedAppeals.delete(message.author.id);
        }
    }
  }
}
