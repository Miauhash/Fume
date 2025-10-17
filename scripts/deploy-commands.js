// /scripts/deploy-commands.js (VERSÃO FINAL E CORRIGIDA)
require('dotenv').config({ path: '.env.production' });
const { REST, Routes } = require('discord.js');

const BOT_TOKEN = process.env.DISCORD_NFT_SELL_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

// Log para garantir que estamos usando os valores corretos
console.log(`CLIENT_ID a ser usado: ${CLIENT_ID}`);
if (!BOT_TOKEN || !CLIENT_ID) {
    console.error("ERRO FATAL: DISCORD_NFT_SELL_TOKEN ou DISCORD_CLIENT_ID não foram encontrados no arquivo .env.production");
    return;
}

const commands = [
    {
        name: 'buy',
        description: 'Starts the process to buy the Starter Pack.',
    },
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log('Iniciando o registro dos comandos (/) do aplicativo.');
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        
        console.log('Comandos (/) do aplicativo recarregados com sucesso.');
    } catch (error) {
        console.error(error);
    }
})();