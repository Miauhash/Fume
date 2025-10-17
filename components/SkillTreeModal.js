import React, { useState, useEffect } from 'react';
import { CLASSES } from '../lib/rpg/classConfig';
import styles from '../styles/SkillTreeModal.module.css';

export default function SkillTreeModal({ isOpen, onClose, nftData, walletAddress, onSkillUnlocked }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillPoints, setSkillPoints] = useState(0);
  const [unlockedSkills, setUnlockedSkills] = useState([]);

  useEffect(() => {
    if (nftData) {
      setUnlockedSkills(nftData.skills || []);
    }
  }, [nftData]);

  if (!isOpen || !nftData) return null;

  const classData = CLASSES[nftData.class];
  if (!classData) return null;

  const handleUnlockSkill = async (skill) => {
    try {
      const response = await fetch('/api/nft/unlock-skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          nftId: nftData.id,
          skillId: skill.id,
          nftClass: nftData.class,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnlockedSkills(data.nftSkills);
        setSkillPoints(data.remainingPoints);
        if (onSkillUnlocked) {
          onSkillUnlocked(data);
        }
        alert(`Habilidade "${skill.name}" desbloqueada com sucesso!`);
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao desbloquear habilidade:', error);
      alert('Erro ao desbloquear habilidade. Tente novamente.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Árvore de Habilidades - {classData.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <p><strong>NFT:</strong> {nftData.name}</p>
            <p><strong>Nível:</strong> {nftData.level || 1}</p>
            <p><strong>Pontos de Habilidade:</strong> {skillPoints}</p>
          </div>

          <div className={styles.skillTree}>
            {Object.entries(classData.skillTree).map(([tier, skills]) => (
              <div key={tier} className={styles.tier}>
                <h3>{tier.replace('tier', 'Nível ')}</h3>
                <div className={styles.skills}>
                  {skills.map((skill) => {
                    const isUnlocked = unlockedSkills.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`${styles.skill} ${isUnlocked ? styles.unlocked : ''}`}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className={styles.skillName}>{skill.name}</div>
                        <div className={styles.skillEffect}>{skill.effect}</div>
                        <div className={styles.skillCost}>
                          {isUnlocked ? 'Desbloqueada' : `${skill.cost} pontos`}
                        </div>
                        {!isUnlocked && (
                          <button
                            className={styles.unlockButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlockSkill(skill);
                            }}
                          >
                            Desbloquear
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

