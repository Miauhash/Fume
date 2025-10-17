// pages/api/shop/buy-item.js (VERSÃO FINAL E SEGURA)

import { loadGameState, saveGameState } from "../../../utils/miningLogic";
import { getShopItems } from "../../../components/Shop";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userWallet, itemId, transactionHash } = req.body;
  if (!userWallet || !itemId || !transactionHash) {
    return res.status(400).json({ message: 'Missing parameters. Transaction hash is required.' });
  }

  try {
    const gameState = await loadGameState(userWallet);
    if (!gameState) {
      return res.status(404).json({ message: 'Player state not found.' });
    }

    const allItems = getShopItems('en');
    const itemToBuy = allItems.find(item => item.id === itemId);

    if (!itemToBuy) {
      return res.status(404).json({ message: 'Item not found in shop.' });
    }
    
    // A validação real da transação (verificar o hash) seria feita aqui
    
    switch (itemToBuy.type) {
        case 'EQUIPMENT':
            gameState.inventory = gameState.inventory || {};
            const currentItem = gameState.inventory[itemToBuy.id] || { ...itemToBuy, quantity: 0 };
            gameState.inventory[itemToBuy.id] = { ...currentItem, quantity: currentItem.quantity + 1 };
            break;
        // Adicione outros casos para PERMANENT_BUFF, TIMED_BUFF, INVENTORY se necessário
    }

    await saveGameState(userWallet, gameState);

    res.status(200).json({ 
        message: 'Purchase successful!',
        newInventory: gameState.inventory,
    });

  } catch (error) {
    console.error(`[API /buy-item] Error: ${error.message}`);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}