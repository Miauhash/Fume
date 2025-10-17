import React, { useState } from 'react';
import styles from '../styles/ExpeditionChoiceModal.module.css';

export default function ExpeditionChoiceModal({ isOpen, onClose, scenario, expedition, walletAddress, nftData, onChoiceMade }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !scenario) return null;

  const handleMakeChoice = async (choice) => {
    setIsProcessing(true);
    setSelectedChoice(choice);

    try {
      const response = await fetch('/api/expeditions/make-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          nftId: nftData.id,
          expeditionId: expedition.expeditionId,
          scenarioId: scenario.id,
          choiceId: choice.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        if (onChoiceMade) {
          onChoiceMade(data);
        }
      } else {
        alert(`Erro: ${data.error}`);
        setIsProcessing(false);
        setSelectedChoice(null);
      }
    } catch (error) {
      console.error('Erro ao fazer escolha:', error);
      alert('Erro ao processar escolha. Tente novamente.');
      setIsProcessing(false);
      setSelectedChoice(null);
    }
  };

  const handleClose = () => {
    setResult(null);
    setSelectedChoice(null);
    setIsProcessing(false);
    onClose();
  };

  const canMakeChoice = (choice) => {
    if (!choice.requirements) return true;

    if (choice.requirements.class && nftData.class !== choice.requirements.class) {
      return false;
    }

    if (choice.requirements.level && nftData.level < choice.requirements.level) {
      return false;
    }

    return true;
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Expedição: Escolha sua Ação</h2>
          <button className={styles.closeButton} onClick={handleClose}>✕</button>
        </div>

        <div className={styles.content}>
          {!result ? (
            <>
              <div className={styles.scenario}>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </div>

              <div className={styles.choices}>
                {scenario.choices.map((choice) => {
                  const canChoose = canMakeChoice(choice);
                  const isSelected = selectedChoice?.id === choice.id;

                  return (
                    <div
                      key={choice.id}
                      className={`${styles.choice} ${!canChoose ? styles.disabled : ''} ${isSelected ? styles.selected : ''}`}
                    >
                      <div className={styles.choiceText}>{choice.text}</div>
                      
                      {choice.requirements && (
                        <div className={styles.requirements}>
                          {choice.requirements.class && (
                            <span className={nftData.class === choice.requirements.class ? styles.reqMet : styles.reqNotMet}>
                              Classe: {choice.requirements.class}
                            </span>
                          )}
                          {choice.requirements.level && (
                            <span className={nftData.level >= choice.requirements.level ? styles.reqMet : styles.reqNotMet}>
                              Nível: {choice.requirements.level}
                            </span>
                          )}
                        </div>
                      )}

                      <div className={styles.successRate}>
                        Taxa de Sucesso: {(choice.successRate * 100).toFixed(0)}%
                      </div>

                      <button
                        className={styles.choiceButton}
                        onClick={() => handleMakeChoice(choice)}
                        disabled={!canChoose || isProcessing}
                      >
                        {isSelected && isProcessing ? 'Processando...' : 'Escolher'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.result}>
              <h3>Resultado</h3>
              <p className={styles.resultMessage}>{result.message}</p>
              
              {result.rewards && (
                <div className={styles.rewards}>
                  <h4>Recompensas:</h4>
                  {result.rewards.xp && <div>XP: +{result.rewards.xp}</div>}
                  {result.rewards.coins && <div>Moedas: +{result.rewards.coins}</div>}
                  {result.rewards.efficiency && <div>Eficiência: +{result.rewards.efficiency}</div>}
                  {result.rewards.resistance && <div>Resistência: +{result.rewards.resistance}</div>}
                  {result.rewards.charisma && <div>Carisma: +{result.rewards.charisma}</div>}
                  {result.rewards.items && result.rewards.items.map((item, index) => (
                    <div key={index}>Item: {item.id} x{item.quantity}</div>
                  ))}
                </div>
              )}

              <button className={styles.continueButton} onClick={handleClose}>
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

