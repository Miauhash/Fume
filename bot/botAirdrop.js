// botAirdrop.js (Versão Final com Importação Corrigida)
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const prisma = new PrismaClient();

// --- CONFIGURAÇÃO ---
const AIRDROP_CHANNEL_ID = process.env.AIRDROP_CHANNEL_ID;
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
// --------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot de Airdrop '${client.user.tag}' está online e vigiando o canal!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || message.channel.id !== AIRDROP_CHANNEL_ID) {
        return;
    }

    const userWallet = message.content.trim();

    if (!SOLANA_ADDRESS_REGEX.test(userWallet)) {
        message.reply("Este endereço de carteira não parece ser válido.").then(msg => {
            setTimeout(() => { try { msg.delete(); } catch(e) {} }, 10000);
        });
        return;
    }

    let feedbackMessage = await message.reply("Processando seu pedido... ⏳");

    try {
        const existingClaim = await prisma.airdropClaim.findUnique({
            where: { userWallet: userWallet },
        });

        if (existingClaim) {
            feedbackMessage.edit(`❌ Erro: Esta carteira já recebeu um airdrop.`);
            return;
        }

        const availableNft = await prisma.nftMintPool.findFirst({
            where: { isMinted: false },
            orderBy: { id: 'asc' },
        });

        if (!availableNft) {
            feedbackMessage.edit("❌ Desculpe, todos os NFTs do airdrop já foram distribuídos!");
            return;
        }
        
        feedbackMessage.edit(`Encontramos o NFT #${availableNft.id}. Enviando para sua carteira... 🚚`);

        const command = `node transfer-engine.js ${availableNft.mintAddress} ${userWallet}`;
        const { stdout, stderr } = await execPromise(command, { cwd: '/var/www/Fumegator' });

        if (stderr) {
            throw new Error(stderr);
        }

        await prisma.$transaction([
            prisma.nftMintPool.update({
                where: { id: availableNft.id },
                data: { isMinted: true, mintedTo: userWallet, mintedAt: new Date() },
            }),
            prisma.airdropClaim.create({
                data: {
                    userWallet: userWallet,
                    nftMintAddress: availableNft.mintAddress,
                    nftId: availableNft.id,
                },
            }),
        ]);
        
        const solscanLink = `https://solscan.io/token/${availableNft.mintAddress}?cluster=devnet`;
        feedbackMessage.edit(`✅ Sucesso! O Especialista #${availableNft.id} foi enviado. Bem-vindo ao Hospital Fumegator!\n\nVeja seu NFT: ${solscanLink}`);

    } catch (error) {
        console.error("Erro no processo de airdrop:", error);
        feedbackMessage.edit(`❌ Ocorreu um erro. A equipe já foi notificada.`);
    }
});

client.login(process.env.DISCORD_TOKEN);