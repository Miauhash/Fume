import React, { useState, useEffect } from 'react';
import styles from '../styles/BossFightModal.module.css';

export default function BossFightModal({ isOpen, onClose, boss, fightState, walletAddress, onActionTaken, onFightEnd }) {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [turnLog, setTurnLog] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (fightState && fightState.teamNFTs.length > 0) {
      const firstAlive = fightState.teamNFTs.find(nft => nft.isAlive);
      if (firstAlive) {
        setSelectedNFT(firstAlive);
      }
    }
  }, [fightState]);

  if (!isOpen || !boss || !fightState) return null;

  const handleAction = async (action, targetId = null) => {
    if (!selectedNFT || isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/bosses/take-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          bossId: boss.id,
          action,
          nftId: selectedNFT.id,
          targetId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTurnLog(data.turnLog);
        
        if (onActionTaken) {
          onActionTaken(data);
        }

        if (data.status === 'victory' || data.status === 'defeat') {
          setTimeout(() => {
            if (onFightEnd) {
              onFightEnd(data);
            }
          }, 2000);
        }
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao realizar ação:', error);
      alert('Erro ao processar ação. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const bossHealthPercent = (fightState.bossHealth / fightState.bossMaxHealth) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Batalha contra {boss.name}</h2>
          <div className={styles.turn}>Turno: {fightState.turn}</div>
        </div>

        <div className={styles.battleArea}>
          {/* Boss Section */}
          <div className={styles.bossSection}>
            <div className={styles.bossIcon}>💀</div>
            <div className={styles.bossName}>{boss.name}</div>
            <div className={styles.healthBar}>
              <div className={styles.healthFill} style={{ width: `${bossHealthPercent}%` }}></div>
              <div className={styles.healthText}>
                {fightState.bossHealth} / {fightState.bossMaxHealth}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className={styles.teamSection}>
            <h3>Sua Equipe</h3>
            <div className={styles.teamGrid}>
              {fightState.teamNFTs.map((nft) => {
                const healthPercent = (nft.currentHealth / nft.maxHealth) * 100;
                const isSelected = selectedNFT?.id === nft.id;

                return (
                  <div
                    key={nft.id}
                    className={`${styles.nftCard} ${!nft.isAlive ? styles.defeated : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => nft.isAlive && setSelectedNFT(nft)}
                  >
                    <div className={styles.nftName}>{nft.name}</div>
                    <div className={styles.nftClass}>{nft.class}</div>
                    <div className={styles.healthBar}>
                      <div className={styles.healthFill} style={{ width: `${healthPercent}%` }}></div>
                      <div className={styles.healthText}>
                        {nft.currentHealth} / {nft.maxHealth}
                      </div>
                    </div>
                    {!nft.isAlive && <div className={styles.defeatedLabel}>Derrotado</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Turn Log */}
        {turnLog.length > 0 && (
          <div className={styles.turnLog}>
            <h4>Último Turno:</h4>
            {turnLog.map((log, index) => (
              <div key={index} className={styles.logEntry}>
                {log.action === 'attack' && (
                  <span>{log.actor} atacou {log.target} causando {log.damage} de dano!</span>
                )}
                {log.action === 'ability' && (
                  <span>{log.actor} usou {log.abilityName} em {log.target} causando {log.damage} de dano!</span>
                )}
                {log.action === 'defend' && (
                  <span>{log.actor} está defendendo!</span>
                )}
                {log.action === 'heal' && (
                  <span>{log.actor} curou {log.target} em {log.amount} pontos de vida!</span>
                )}
                {log.action === 'defeated' && (
                  <span className={styles.defeated}>{log.actor} foi derrotado!</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {fightState.status === 'active' && selectedNFT && selectedNFT.isAlive && (
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => handleAction('attack')}
              disabled={isProcessing}
            >
              ⚔️ Atacar
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleAction('defend')}
              disabled={isProcessing}
            >
              🛡️ Defender
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleAction('heal', selectedNFT.id)}
              disabled={isProcessing}
            >
              💚 Curar
            </button>
          </div>
        )}

        {/* Victory/Defeat Message */}
        {(fightState.status === 'victory' || fightState.status === 'defeat') && (
          <div className={`${styles.endMessage} ${fightState.status === 'victory' ? styles.victory : styles.defeat}`}>
            <h2>{fightState.status === 'victory' ? '🎉 VITÓRIA!' : '💀 DERROTA!'}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

