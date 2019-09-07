const { Command } = require('discord.js-commando');
const { getWarnings, setWarnings } = require('../../util/database');
const { MODLOG } = process.env;
const { MessageEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'mod',
            memberName: 'warn',
            guildOnly: true,
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            description: 'Issue a warning to a user.',
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would like to warn?',
                    type: 'user'
                },
                {
                    key: 'reason',
                    prompt: 'What is the reason for the warn?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, { user, reason }) {
        const wa = getWarnings(user.id);

        const modlog = this.client.channels.find(x => x.name === MODLOG);

        if(!modlog) {
            await msg.guild.createChannel(MODLOG, 'text');
        }

        wa.warnings++;

        setWarnings(wa);

        const log = new MessageEmbed()
            .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({size: 2048}))
            .setColor(0x800080)
            .setDescription(`**Action:** Warning\n**Target:** ${user.tag} (${user.id})\n**Current Warnings:** ${wa.warnings}\n**Reason:** ${reason}`)
            .setTimestamp()
        
        await modlog.send(log);
    }
}