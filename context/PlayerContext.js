import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRonin } from './RoninContext';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { userAddress } = useRonin();
  const [playerData, setPlayerData] = useState(null);
  const [playerNFTs, setPlayerNFTs] = useState([]);
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  const fetchPlayerData = async (address) => {
    if (!address) {
      setPlayerData(null);
      setPlayerNFTs([]);
      setLoadingPlayer(false);
      return;
    }
    setLoadingPlayer(true);
    try {
      // Fetch player data (coins, materials, researched technologies, etc.)
      const playerRes = await fetch(`/api/player/status?wallet=${address}`);
      const playerData = await playerRes.json();
      setPlayerData(playerData);

      // Fetch player NFTs with their RPG attributes
      const nftsRes = await fetch(`/api/nft/player-nfts?wallet=${address}`);
      const nftsData = await nftsRes.json();
      setPlayerNFTs(nftsData);

    } catch (error) {
      console.error("Erro ao buscar dados do jogador:", error);
      setPlayerData(null);
      setPlayerNFTs([]);
    } finally {
      setLoadingPlayer(false);
    }
  };

  useEffect(() => {
    fetchPlayerData(userAddress);
  }, [userAddress]);

  const updatePlayerData = (newData) => {
    setPlayerData(prev => ({ ...prev, ...newData }));
  };

  const updatePlayerNFT = (nftId, newNftData) => {
    setPlayerNFTs(prev => prev.map(nft => 
      (nft.id === nftId || nft.tokenId === nftId) ? { ...nft, ...newNftData } : nft
    ));
  };

  return (
    <PlayerContext.Provider value={{
      playerData,
      playerNFTs,
      loadingPlayer,
      fetchPlayerData,
      updatePlayerData,
      updatePlayerNFT,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

