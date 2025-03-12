// src/pages/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Sword, TrendingUp, BarChart, AlertCircle } from 'lucide-react';
import { regions } from '../lib/utils';
import { useApi } from '../contexts/ApiContext';
import { useTopPlayers, useGameVersion } from '../hooks/useRiotApi';
import { LoadingState, ErrorState } from '../components/LoadingErrorStates';

export function Home() {
  const navigate = useNavigate();
  const { 
    selectedRegion, 
    setSelectedRegion, 
    recentSearches, 
    addRecentSearch,
    gameVersion
  } = useApi();
  
  const [summonerName, setSummonerName] = useState('');

  // Récupération des joueurs du haut du classement
  const { 
    data: topPlayers, 
    isLoading: isLoadingTopPlayers, 
    error: topPlayersError 
  } = useTopPlayers('RANKED_SOLO_5x5', 'CHALLENGER', 'I', selectedRegion);

  // Recherche d'invocateur
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim()) {
      addRecentSearch(summonerName);
      navigate(`/summoner/${selectedRegion}/${encodeURIComponent(summonerName)}`);
    }
  };

  // Formater les données des meilleurs joueurs
  const formattedTopPlayers = topPlayers?.slice(0, 3).map((player, index) => ({
    name: player.summonerName,
    lp: player.leaguePoints,
    rank: index + 1
  })) || [];

  // Pour les champions meta, nous utiliserions idéalement une API tierce
  // Comme nous n'en avons pas, nous afficherons un message d'information
  const metaChampionsMessage = "Les statistiques des champions meta requièrent des données supplémentaires";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Rechercher un invocateur
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Analysez vos performances, suivez vos statistiques et découvrez les meilleurs champions de la méta
        </p>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-1">
          <div className="relative flex-shrink-0">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-gray-800/80 border border-gray-600 rounded-lg px-4 h-12 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="Nom d'invocateur..."
              className="w-full h-12 bg-gray-800/80 border border-gray-600 text-white rounded-lg pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <div className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg flex items-center justify-center p-2">
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </button>
          </div>
        </form>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Top Joueurs</h3>
            </div>
            
            {isLoadingTopPlayers ? (
              <LoadingState message="Chargement du classement..." />
            ) : topPlayersError ? (
              <ErrorState message="Impossible de charger les meilleurs joueurs" />
            ) : formattedTopPlayers.length > 0 ? (
              <div className="space-y-3">
                {formattedTopPlayers.map((player) => (
                  <div key={player.name} className="flex items-center space-x-3 bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/80 transition-colors">
                    <span className="font-mono font-bold text-blue-400 w-6">#{player.rank}</span>
                    <span className="text-white">{player.name}</span>
                    <span className="ml-auto text-gray-400">{player.lp} LP</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                Aucun joueur trouvé pour cette région
              </div>
            )}
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <Sword className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Champions Meta</h3>
            </div>
            
            <div className="flex items-center justify-center h-40 text-center">
              <div className="text-gray-400 flex flex-col items-center gap-3">
                <AlertCircle className="h-6 w-6 text-blue-400" />
                <p>{metaChampionsMessage}</p>
                <p className="text-sm">Nécessite une API tierce</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <BarChart className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Dernières Recherches</h3>
            </div>
            
            {recentSearches.length > 0 ? (
              <div className="space-y-3">
                {recentSearches.map((name) => (
                  <div 
                    key={name} 
                    className="flex items-center space-x-3 bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/80 transition-colors cursor-pointer group/item"
                    onClick={() => navigate(`/summoner/${selectedRegion}/${encodeURIComponent(name)}`)}
                  >
                    <span className="text-white group-hover/item:text-blue-400 transition-colors">{name}</span>
                    <span className="ml-auto text-sm text-gray-400">{regions.find(r => r.id === selectedRegion)?.name.split(' ')[0]}</span>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover/item:text-blue-400 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                Aucune recherche récente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}