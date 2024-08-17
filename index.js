const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageButton, MessageActionRow } = require('discord-buttons');
require('discord-buttons')(client);

const CHANNEL_ID = '1274443859207655434'; // ID del canal
const VERIFY_ROLE_ID = '1274192724073119774'; // ID del rol de verificación
const ERROR_ROLE_ID = '1274448805982375977'; // ID del rol que causa error

client.once('ready', () => {
    console.log('Bot online');
    client.user.setActivity('Verificando usuarios');

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error(`Canal con ID ${CHANNEL_ID} no encontrado.`);
        return;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle("¡Bienvenido!")
        .setDescription("Por favor, verifica haciendo clic en el botón de abajo.")
        .setColor('#38A800');

    const verifyButton = new MessageButton()
        .setLabel('Verificar')
        .setStyle('blurple')
        .setEmoji('✅')
        .setID('verify_button');

    const row = new MessageActionRow()
        .addComponents(verifyButton);

    channel.send({
        embed: embed,
        components: [row]
    }).catch(console.error);
});

client.on('clickButton', async (button) => {
    if (button.id === 'verify_button') {
        const role = button.guild.roles.cache.get(VERIFY_ROLE_ID);
        const member = button.clicker.member;

        if (!role) {
            button.reply.send('Rol de verificación no encontrado.', true);
            return;
        }

        if (!member) {
            button.reply.send('Miembro no encontrado.', true);
            return;
        }

        try {
            // Verificar si el bot tiene el permiso para gestionar roles
            if (!button.guild.me.permissions.has('MANAGE_ROLES')) {
                button.reply.send('No tengo permiso para asignar roles.', true);
                return;
            }

            // Intentar añadir el rol de verificación
            await member.roles.add(role);
            button.reply.send('¡Ahora estás verificado!', true);
        } catch (error) {
            button.reply.send('Hubo un error al asignar el rol.', true);
            console.error('Error al añadir el rol:', error);
        }
    }
});

client.login('TU_TOKEN_DEL_BOT'); // Reemplaza con tu token
