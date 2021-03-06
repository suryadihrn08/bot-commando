const { Command } = require('discord.js-commando');
const { findChannel, findGuild } = require('../../util/Util');
const { MessageEmbed } = require('discord.js');

module.exports = class suggestionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'suggestion',
            group: 'general',
            memberName: 'suggestion',
            aliases: ['suggest'],
            description: 'Suggest an improvement for the bot/server.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 30
            },
            args: [
                {
                    type: "string",
                    prompt: "What is your suggestion?",
                    key: "string"
                }
            ]
        });
    }

    async run(msg, { string }) {
        const guild = findGuild(this.client, process.env.GUILDID)
        const channel = findChannel(guild, process.env.SUGGEST);
        const embed = new MessageEmbed()
            .setTitle("New Suggestion")
            .setDescription(string)
            .setColor("RED")
            .setThumbnail(msg.author.displayAvatarURL({size: 2048}))
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({size: 2048}))
            .setFooter(`User ID: ${msg.author.id}`)
            .setTimestamp()

        const message = await channel.send(embed);
        await msg.react('✅');
        return msg.reply(`Your suggestion has been successfully submitted!`);
    }
}