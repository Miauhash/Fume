// /scripts/bot.js (VERSÃO FINAL, COMPLETA, AUTOCONTIDA E COM COMPRA ÚNICA)

require('dotenv').config({ path: '.env.production' });

const { Client, GatewayIntentBits, Partials, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');

// <<< O ABI ESTÁ AGORA DIRETAMENTE DENTRO DESTE ARQUIVO, ELIMINANDO O ERRO >>>
const FUMEGATOR_SPECIALIST_ABI = [
	{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" } ], "name": "mintBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newBaseURI", "type": "string" } ], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }
];

// --- CONFIGURAÇÃO ---
const BOT_TOKEN = process.env.DISCORD_NFT_SELL_TOKEN;
const LOG_CHANNEL_ID = '1417903610205044968';
const BUY_CHANNEL_ID = '1417903324652638279';
const TREASURY_ADDRESS = '0x8DB301675Cb02c1277F472eeD5685d945bE4d5d8';
const PAYMENT_AMOUNT = '0.5';
const NFTS_TO_SEND = 2;

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const VAULT_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
const RPC_URL = process.env.SAIGON_RPC_URL;
// --------------------

const prisma = new PrismaClient();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const vaultWallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, vaultWallet);

const pendingUsers = new Map();

client.once('clientReady', c => {
    console.log(`Bot ${c.user.tag} está online e pronto para vender!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'buy') {
        if (interaction.channelId !== BUY_CHANNEL_ID) {
            return interaction.reply({ content: `This command can only be used in the <#${BUY_CHANNEL_ID}> channel.`, ephemeral: true });
        }
        try {
            await interaction.deferReply({ ephemeral: true });
            const buyChannel = await client.channels.fetch(BUY_CHANNEL_ID);
            if (!buyChannel?.threads) throw new Error("The purchase channel does not support threads.");

            const thread = await buyChannel.threads.create({
                name: `purchase-${interaction.user.username}-${Date.now()}`.slice(0, 100),
                autoArchiveDuration: 60,
                type: ChannelType.PrivateThread,
                reason: `Starter Pack purchase for ${interaction.user.tag}`
            });
            await thread.members.add(interaction.user.id);
            await interaction.editReply({ content: `I have created a private thread for you to continue the purchase process: ${thread}` });
            
            pendingUsers.set(interaction.user.id, { step: 'awaiting_wallet', thread: thread });
            await thread.send(`Hello ${interaction.user}! Please paste your Ronin wallet address (starting with 0x).`);
        } catch (error) {
            console.error("Failed to process /buy command:", error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: 'Sorry, a critical error occurred. Please contact an administrator.' });
            }
        }
    }

    if (interaction.isButton() && interaction.customId === 'close_ticket') {
        try {
            await interaction.reply({ content: 'This ticket will be closed and archived in 5 seconds.', ephemeral: true });
            setTimeout(async () => {
                try {
                    if (interaction.channel.isThread()) {
                        await interaction.channel.setLocked(true, 'Ticket closed by user.').catch(e => console.error("Failed to lock thread:", e));
                        await interaction.channel.setArchived(true, 'Ticket closed by user.').catch(e => console.error("Failed to archive thread:", e));
                    }
                } catch (e) {
                    console.error("Error during thread archival:", e);
                }
            }, 5000);
        } catch (error) {
            console.error("Error handling close button:", error);
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.channel.isThread()) return;
    const userData = pendingUsers.get(message.author.id);
    if (!userData || message.channel.id !== userData.thread.id) return;

    if (userData.step === 'awaiting_wallet') {
        const userAddress = message.content.trim().toLowerCase().replace('ronin:', '0x');
        if (!ethers.utils.isAddress(userAddress)) {
            return message.reply("This is not a valid Ronin address.");
        }
        userData.walletAddress = userAddress;
        userData.step = 'awaiting_hash';
        pendingUsers.set(message.author.id, userData);
        
        return message.reply(`Thank you. Please send exactly **${PAYMENT_AMOUNT} RON** to \`${TREASURY_ADDRESS}\`.\n\nAfter sending, paste the **Transaction Hash (TxHash)** here.`);
    }

    if (userData.step === 'awaiting_hash') {
        const txHash = message.content.trim();
        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            return message.reply("This does not look like a valid transaction hash.");
        }
        await message.reply("Thank you. Verifying your payment on the blockchain...");
        await deliverNFTs(message.author.id, userData.walletAddress, txHash, userData.thread);
    }
});

async function deliverNFTs(userId, recipientAddress, paymentHash, thread) {
    const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
    pendingUsers.delete(userId);

    try {
        const gameState = await prisma.gameState.findUnique({
            where: { wallet: recipientAddress },
        });
        
        if (gameState?.starterPackClaimed) {
            throw new Error("This wallet has already claimed the Starter Pack.");
        }
        
        const tx = await provider.getTransaction(paymentHash);
        const expectedValue = ethers.utils.parseEther(PAYMENT_AMOUNT);

        if (!tx || tx.to.toLowerCase() !== TREASURY_ADDRESS.toLowerCase() || !tx.value.eq(expectedValue) || tx.from.toLowerCase() !== recipientAddress.toLowerCase()) {
            throw new Error("Payment verification failed.");
        }
        
        await thread.send("Payment confirmed! Your NFTs are being delivered...");
        
        const vaultAddress = vaultWallet.address.toLowerCase();
        const availableNfts = await prisma.nft.findMany({
            where: { ownerWallet: vaultAddress },
            take: NFTS_TO_SEND,
        });

        if (availableNfts.length < NFTS_TO_SEND) {
            throw new Error(`Starter Pack is out of stock.`);
        }

        let transferHashes = [];
        for (const nft of availableNfts) {
            const gasPrice = await provider.getGasPrice();
            const txOptions = { gasPrice: gasPrice.mul(150).div(100) };
            const transferTx = await nftContract.safeTransferFrom(vaultAddress, recipientAddress, nft.tokenId, txOptions);
            await transferTx.wait(1);
            transferHashes.push(transferTx.hash);
            
            await prisma.nft.update({
                where: { tokenId: nft.tokenId },
                data: { ownerWallet: recipientAddress }
            });
        }

        await prisma.gameState.upsert({
            where: { wallet: recipientAddress },
            update: { starterPackClaimed: true },
            create: { 
                wallet: recipientAddress, 
                starterPackClaimed: true,
                state: {}
            }
        });
        console.log(`[BOT] Flag 'starterPackClaimed' set to true for ${recipientAddress}`);

        const explorerUrl = "https://saigon-app.roninchain.com/tx/";
        const links = transferHashes.map((index, hash) => `[NFT #${index + 1} Tx](${explorerUrl}${hash})`).join('\n');
        const successEmbed = { title: "Delivery Complete!", description: `You have received ${NFTS_TO_SEND} NFTs.\n\n${links}`, color: 0x28a745 };
        const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Purchase').setStyle(ButtonStyle.Secondary).setEmoji('🔒'));
        await thread.send({ embeds: [successEmbed], components: [closeButton] });
        logChannel.send(`✅ SUCCESS: Delivered Starter Pack to <@${userId}> (${recipientAddress}). Payment TX: \`${paymentHash}\``);
    } catch (error) {
        console.error(`Failed to deliver NFTs to ${recipientAddress}:`, error);
        await thread.send(`Sorry, a critical error occurred: ${error.message}. Please contact an administrator.`);
        logChannel.send(`❌ FAILED: Delivery to <@${userId}> (${recipientAddress}) failed. Payment TX: \`${paymentHash}\`\nError: ${error.message}`);
    }
}

client.login(BOT_TOKEN);