import React, { useState, useEffect } from 'react';
import { TECHNOLOGY_TREE, canResearchTechnology } from '../lib/research/technologyTree';
import styles from '../styles/TechnologyTreeModal.module.css';

export default function TechnologyTreeModal({ isOpen, onClose, walletAddress, playerData, onTechnologyUnlocked }) {
  const [selectedTech, setSelectedTech] = useState(null);
  const [researchedTechs, setResearchedTechs] = useState([]);

  useEffect(() => {
    if (playerData) {
      setResearchedTechs(playerData.researchedTechnologies || []);
    }
  }, [playerData]);

  if (!isOpen) return null;

  const handleResearchTechnology = async (tech) => {
    try {
      const response = await fetch('/api/research/unlock-technology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          technologyId: tech.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResearchedTechs(data.researchedTechnologies);
        if (onTechnologyUnlocked) {
          onTechnologyUnlocked(data);
        }
        alert(`Tecnologia "${tech.name}" pesquisada com sucesso!`);
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao pesquisar tecnologia:', error);
      alert('Erro ao pesquisar tecnologia. Tente novamente.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Árvore de Pesquisa Tecnológica</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <p><strong>Moedas:</strong> {playerData?.coins || 0}</p>
            <p><strong>Tecnologias Pesquisadas:</strong> {researchedTechs.length}</p>
          </div>

          <div className={styles.categories}>
            {Object.entries(TECHNOLOGY_TREE).map(([categoryKey, category]) => (
              <div key={categoryKey} className={styles.category}>
                <h3>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
                
                <div className={styles.technologies}>
                  {category.technologies.map((tech) => {
                    const isResearched = researchedTechs.includes(tech.id);
                    const canResearch = canResearchTechnology(tech.id, researchedTechs);
                    
                    return (
                      <div
                        key={tech.id}
                        className={`${styles.technology} ${isResearched ? styles.researched : ''} ${!canResearch && !isResearched ? styles.locked : ''}`}
                        onClick={() => setSelectedTech(tech)}
                      >
                        <div className={styles.techIcon}>{tech.icon}</div>
                        <div className={styles.techName}>{tech.name}</div>
                        <div className={styles.techTier}>Nível {tech.tier}</div>
                        <div className={styles.techDescription}>{tech.description}</div>
                        
                        <div className={styles.techCost}>
                          <div>💰 {tech.cost.coins}</div>
                          {tech.cost.materials.map((mat) => (
                            <div key={mat.id}>{mat.id}: {mat.quantity}</div>
                          ))}
                        </div>

                        {isResearched ? (
                          <div className={styles.researchedBadge}>✓ Pesquisada</div>
                        ) : canResearch ? (
                          <button
                            className={styles.researchButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResearchTechnology(tech);
                            }}
                          >
                            Pesquisar
                          </button>
                        ) : (
                          <div className={styles.lockedBadge}>🔒 Bloqueada</div>
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

