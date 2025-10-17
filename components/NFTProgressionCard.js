import React, { useState, useEffect } from 'react';
import { getXPForLevel, getMiningBonus, calculateAttributes } from '../lib/rpg/classConfig';
import styles from '../styles/NFTProgressionCard.module.css';

export default function NFTProgressionCard({ nft, walletAddress, onOpenSkillTree }) {
  const [nftData, setNftData] = useState({
    level: 1,
    xp: 0,
    skills: [],
  });

  useEffect(() => {
    // Carregar dados do NFT (em produção, buscar do banco de dados)
    // Por enquanto, usar dados simulados
    setNftData({
      level: nft.level || 1,
      xp: nft.xp || 0,
      skills: nft.skills || [],
    });
  }, [nft]);

  const nextLevelXP = getXPForLevel(nftData.level + 1);
  const xpProgress = (nftData.xp / nextLevelXP) * 100;

  const attributes = calculateAttributes(
    {
      efficiency: nft.efficiency || 50,
      resistance: nft.resistance || 50,
      charisma: nft.charisma || 50,
    },
    nftData.level,
    nftData.skills
  );

  const miningBonus = getMiningBonus(nft.class, nftData.level, nftData.skills);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{nft.name}</h3>
        <span className={styles.class}>{nft.class}</span>
      </div>

      <div className={styles.level}>
        <div className={styles.levelInfo}>
          <span>Nível {nftData.level}</span>
          <span>{nftData.xp} / {nextLevelXP} XP</span>
        </div>
        <div className={styles.xpBar}>
          <div className={styles.xpProgress} style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      <div className={styles.attributes}>
        <div className={styles.attribute}>
          <span className={styles.attributeName}>Eficiência</span>
          <span className={styles.attributeValue}>{attributes.efficiency}</span>
        </div>
        <div className={styles.attribute}>
          <span className={styles.attributeName}>Resistência</span>
          <span className={styles.attributeValue}>{attributes.resistance}</span>
        </div>
        <div className={styles.attribute}>
          <span className={styles.attributeName}>Carisma</span>
          <span className={styles.attributeValue}>{attributes.charisma}</span>
        </div>
      </div>

      <div className={styles.miningBonus}>
        <span>Bônus de Mineração:</span>
        <span className={styles.bonusValue}>+{miningBonus.toFixed(1)}%</span>
      </div>

      <div className={styles.skills}>
        <span>Habilidades Desbloqueadas: {nftData.skills.length}</span>
        <button className={styles.skillTreeButton} onClick={() => onOpenSkillTree(nft)}>
          Árvore de Habilidades
        </button>
      </div>
    </div>
  );
}

