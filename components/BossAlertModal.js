import React from 'react';
import styles from '../styles/BossAlertModal.module.css';

export default function BossAlertModal({ isOpen, onClose, boss, onStartFight }) {
  if (!isOpen || !boss) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.alertBanner}>
          ⚠️ ALERTA DE CHEFE ⚠️
        </div>

        <div className={styles.bossImage}>
          <div className={styles.bossIcon}>💀</div>
        </div>

        <div className={styles.bossInfo}>
          <h2 className={styles.bossName}>{boss.name}</h2>
          <div className={styles.bossTier}>Nível de Ameaça: {boss.tier}</div>
          <p className={styles.bossDescription}>{boss.description}</p>
        </div>

        <div className={styles.bossStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Vida</span>
            <span className={styles.statValue}>{boss.health}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Ataque</span>
            <span className={styles.statValue}>{boss.attack}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Defesa</span>
            <span className={styles.statValue}>{boss.defense}</span>
          </div>
        </div>

        <div className={styles.abilities}>
          <h3>Habilidades</h3>
          <div className={styles.abilityList}>
            {boss.abilities.map((ability) => (
              <div key={ability.id} className={styles.ability}>
                <div className={styles.abilityName}>{ability.name}</div>
                <div className={styles.abilityDescription}>{ability.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.weaknesses}>
          <h4>Fraquezas:</h4>
          <div className={styles.weaknessList}>
            {boss.weaknesses.map((weakness, index) => (
              <span key={index} className={styles.weakness}>{weakness}</span>
            ))}
          </div>
        </div>

        <div className={styles.rewards}>
          <h4>Recompensas:</h4>
          <div className={styles.rewardList}>
            <div>XP: {boss.rewards.xp}</div>
            <div>Moedas: {boss.rewards.coins}</div>
            {boss.rewards.items.map((item, index) => (
              <div key={index} className={styles.rewardItem}>
                {item.id} x{item.quantity} ({item.rarity})
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.fightButton} onClick={() => onStartFight(boss)}>
            ⚔️ Iniciar Batalha
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            Fugir
          </button>
        </div>
      </div>
    </div>
  );
}

