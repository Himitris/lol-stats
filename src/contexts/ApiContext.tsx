// src/contexts/ApiContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApiKeyValidation, useGameVersion } from '../hooks/useRiotApi';
import { regions } from '../lib/utils';

interface ApiContextType {
  isApiKeyValid: boolean;
  isValidatingApiKey: boolean;
  apiKeyError: Error | null;
  gameVersion: string | undefined;
  isLoadingGameVersion: boolean;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  recentSearches: string[];
  addRecentSearch: (summonerName: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  // Récupérer la région du localStorage ou utiliser la valeur par défaut
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    return savedRegion || regions[0].id;
  });

  // Récupérer les recherches récentes du localStorage ou utiliser un tableau vide
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  // Vérifier si la clé API est valide
  const { 
    data: isApiKeyValid = false, 
    isLoading: isValidatingApiKey, 
    error: apiKeyError 
  } = useApiKeyValidation();

  // Récupérer la version actuelle du jeu
  const { 
    data: gameVersion, 
    isLoading: isLoadingGameVersion 
  } = useGameVersion();

  // Sauvegarder la région sélectionnée dans le localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('selectedRegion', selectedRegion);
  }, [selectedRegion]);

  // Fonction pour ajouter une recherche récente
  const addRecentSearch = (summonerName: string) => {
    if (!summonerName) return;
    
    setRecentSearches(prevSearches => {
      // Filtrer les doublons et limiter à 5 recherches récentes
      const updatedSearches = [
        summonerName,
        ...prevSearches.filter(name => name !== summonerName)
      ].slice(0, 5);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      return updatedSearches;
    });
  };

  const value = {
    isApiKeyValid,
    isValidatingApiKey,
    apiKeyError: apiKeyError as Error | null,
    gameVersion,
    isLoadingGameVersion,
    selectedRegion,
    setSelectedRegion,
    recentSearches,
    addRecentSearch
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}