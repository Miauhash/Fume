// context/RoninContext.js

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ethers } from "ethers";

// Criando o contexto
const RoninContext = createContext();

// Hook customizado para usar o contexto facilmente
export const useRonin = () => {
  return useContext(RoninContext);
};

// Componente Provedor
export function RoninProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para conectar a carteira
  const connectWallet = useCallback(async () => {
    // Adicionamos uma verificação extra aqui também
    if (
      typeof window === "undefined" ||
      !window.ronin ||
      !window.ronin.provider
    ) {
      console.error("Ronin Wallet not found. Please install the extension.");
      setError("Por favor, instale a Ronin Wallet para continuar.");
      // Opcional: Redirecionar para a página de download
      // window.open('https://wallet.skymavis.com/', '_blank');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const web3Provider = new ethers.providers.Web3Provider(
        window.ronin.provider,
        "any"
      );
      await web3Provider.send("eth_requestAccounts", []);
      const currentSigner = web3Provider.getSigner();
      const address = await currentSigner.getAddress();
      const net = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(currentSigner);
      setUserAddress(address);
      setNetwork(net);
    } catch (e) {
      console.error("Failed to connect Ronin Wallet:", e);
      setError("Falha ao conectar a carteira. Por favor, tente novamente.");
      disconnectWallet();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para desconectar
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
    setNetwork(null);
  };

  // Efeito para lidar com mudanças de conta ou rede
  useEffect(() => {
    // A VERIFICAÇÃO MAIS IMPORTANTE - SÓ EXECUTA NO NAVEGADOR
    if (
      typeof window !== "undefined" &&
      window.ronin &&
      window.ronin.provider
    ) {
      const roninProvider = window.ronin.provider;

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          window.location.reload();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      roninProvider.on("accountsChanged", handleAccountsChanged);
      roninProvider.on("chainChanged", handleChainChanged);

      // Função de limpeza para remover os listeners quando o componente for desmontado
      return () => {
        roninProvider.removeListener("accountsChanged", handleAccountsChanged);
        roninProvider.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const value = {
    provider,
    signer,
    userAddress,
    network,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <RoninContext.Provider value={value}>{children}</RoninContext.Provider>
  );
}
