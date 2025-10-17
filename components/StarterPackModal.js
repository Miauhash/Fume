// components/StarterPackModal.js (FINAL VERSION - ENGLISH TRANSLATION)
import { useState, useCallback } from 'react';
import { useRonin } from '../context/RoninContext';
import { ethers } from 'ethers';
import styles from '../styles/FeatureModal.module.css';
import modalStyles from '../styles/MintPage.module.css';
import LoadingSpinner from './LoadingSpinner';

const STARTER_PACK_PRICE_RON = "300"; // Valor em RON equivalente a 300 DÓLARES, a ser ajustado conforme a cotação
const TREASURY_WALLET_RONIN = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS_RONIN;

export default function StarterPackModal({ isOpen, onClose, onPackClaimed }) {
  const { userAddress, signer, provider, connectWallet } = useRonin();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handlePurchase = useCallback(async () => {
    setIsLoading(true);
    setFeedback({ message: 'Processando compra...', type: 'info' });
    try {
      // A lógica de compra real será tratada pela função onPurchase passada via props
      // Aqui, apenas simulamos o feedback visual
      await onPurchase({ id: 'starter_pack_nft', type: 'NFT_BUNDLE', price: STARTER_PACK_PRICE_RON, currency: 'RON' });
      setFeedback({ message: "Success! Your Starter Pack has been sent.", type: 'success' });
      setTimeout(onClose, 2000);
    } catch (error) {
      setFeedback({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onPurchase]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Starter Pack</h1>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <main className={styles.mainContent} style={{ padding: '2rem' }}>
          <div className={modalStyles.mintCard} style={{ border: 'none', padding: 0 }}>
            <img src="/img/logo.png" alt="Fumegator Logo" className={modalStyles.logo} />
            <p className={modalStyles.description} style={{ fontSize: '1rem' }}>
              Adquira sua equipe inicial de 5 especialistas (um de cada raridade, exceto Místico) por ${STARTER_PACK_PRICE_RON} RON e comece sua jornada em Hospital Fumegator!
            </p>
            
            {isLoading ? (
                <LoadingSpinner message={feedback.message} />
            ) : (
                <button 
                    className={modalStyles.mintButton} 
                    onClick={userAddress ? handlePurchase : connectWallet} 
                    disabled={isLoading}
                >
                    {userAddress ? `Buy for ${STARTER_PACK_PRICE_RON} RON` : 'Connect Wallet'}
                </button>
            )}

            {feedback.message && !isLoading && (
                <p className={feedback.type === 'error' ? modalStyles.feedbackError : modalStyles.feedbackSuccess}>
                    {feedback.message}
                </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}