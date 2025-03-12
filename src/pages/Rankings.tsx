// src/pages/Rankings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trophy, TrendingUp, TrendingDown, Minus, InfoIcon } from 'lucide-react';
import { regions } from '../lib/utils';
import { useApi } from '../contexts/ApiContext';
import { useTopPlayers } from '../hooks/useRiotApi';
import { LoadingState, ErrorState, NoResults } from '../components/LoadingErrorStates';

export function Rankings() {
  const navigate = useNavigate();
  const { selectedRegion, setSelectedRegion } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [queue, setQueue] = useState('RANKED_SOLO_5x5');
  const [tier, setTier] = useState('CHALLENGER');
  const [division, setDivision] = useState('I');

  // Récupérer les données du classement depuis l'API
  const { 
    data: rankingData, 
    isLoading: isLoadingRankings, 
    error: rankingsError 
  } = useTopPlayers(queue, tier, division, selectedRegion);

  // Filtrer les joueurs en fonction de la recherche
  const filteredPlayers = rankingData 
    ? rankingData
        .filter(player => 
          player.summonerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 100) // Limiter le nombre de joueurs affichés
    : [];

  // Formater les données pour l'affichage
  const formattedPlayers = filteredPlayers.map((player, index) => {
    // Calculer le taux de victoire
    const totalGames = player.wins + player.losses;
    const winRate = totalGames > 0 
      ? Math.round((player.wins / totalGames) * 100 * 10) / 10 
      : 0;
    
    // Générer une tendance aléatoire (normalement basée sur les données historiques)
    const trends = ['up', 'down', 'stable'];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)] as 'up' | 'down' | 'stable';
    
    return {
      rank: index + 1,
      username: player.summonerName,
      region: selectedRegion,
      tier: player.tier,
      lp: player.leaguePoints,
      winRate,
      gamesPlayed: totalGames,
      trend: randomTrend
    };
  });

  // Fonction pour afficher l'icône de tendance
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  // Fonction pour naviguer vers le profil d'un joueur
  const goToPlayerProfile = (username: string) => {
    navigate(`/summoner/${selectedRegion}/${encodeURIComponent(username)}`);
  };

  // Options pour les files de classement
  const queueOptions = [
    { id: 'RANKED_SOLO_5x5', name: 'Solo/Duo' },
    { id: 'RANKED_FLEX_SR', name: 'Flex 5v5' }
  ];

  // Options pour les tiers
  const tierOptions = [
    { id: 'CHALLENGER', name: 'Challenger' },
    { id: 'GRANDMASTER', name: 'Grandmaster' },
    { id: 'MASTER', name: 'Master' },
    { id: 'DIAMOND', name: 'Diamond' },
    { id: 'PLATINUM', name: 'Platinum' },
    { id: 'GOLD', name: 'Gold' },
    { id: 'SILVER', name: 'Silver' },
    { id: 'BRONZE', name: 'Bronze' },
    { id: 'IRON', name: 'Iron' }
  ];

  // Options pour les divisions (uniquement pour les tiers en dessous de Master)
  const divisionOptions = [
    { id: 'I', name: 'I' },
    { id: 'II', name: 'II' },
    { id: 'III', name: 'III' },
    { id: 'IV', name: 'IV' }
  ];

  // Déterminer si les divisions doivent être affichées
  const showDivisions = ['DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'].includes(tier);

  // Gérer le changement de tier
  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTier = e.target.value;
    setTier(newTier);
    
    // Si le nouveau tier est Challenger, Grandmaster ou Master, définir la division sur I
    if (['CHALLENGER', 'GRANDMASTER', 'MASTER'].includes(newTier)) {
      setDivision('I');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Classement
          </h1>
          <p className="text-gray-400 mt-2">Les meilleurs joueurs par région</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <select
            value={queue}
            onChange={(e) => setQueue(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {queueOptions.map((queueOption) => (
              <option key={queueOption.id} value={queueOption.id}>
                {queueOption.name}
              </option>
            ))}
          </select>
          <select
            value={tier}
            onChange={handleTierChange}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tierOptions.map((tierOption) => (
              <option key={tierOption.id} value={tierOption.id}>
                {tierOption.name}
              </option>
            ))}
          </select>
          {showDivisions && (
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {divisionOptions.map((divisionOption) => (
                <option key={divisionOption.id} value={divisionOption.id}>
                  {divisionOption.name}
                </option>
              ))}
            </select>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {(tier === 'CHALLENGER' || tier === 'GRANDMASTER' || tier === 'MASTER') && (
        <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 p-4 flex items-center gap-3">
          <InfoIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <p className="text-gray-300 text-sm">
            Les données de tendance sont générées aléatoirement car l'API Riot ne fournit pas d'historique de classement.
            Dans une application réelle, ces données proviendraient d'un suivi quotidien du classement.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6 col-span-full">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">{`Top ${tier}${showDivisions ? ` ${division}` : ''}`}</h2>
          </div>
          
          {isLoadingRankings && (
            <LoadingState message="Chargement du classement..." />
          )}
          
          {rankingsError && (
            <ErrorState 
              message="Impossible de charger les données du classement" 
              retryAction={() => window.location.reload()}
            />
          )}
          
          {!isLoadingRankings && !rankingsError && formattedPlayers.length === 0 && (
            <NoResults message="Aucun joueur trouvé pour ce classement" />
          )}
          
          {!isLoadingRankings && !rankingsError && formattedPlayers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left">Rang</th>
                    <th className="px-6 py-4 text-left">Joueur</th>
                    <th className="px-6 py-4 text-center">LP</th>
                    <th className="px-6 py-4 text-center">Win Rate</th>
                    <th className="px-6 py-4 text-center">Parties</th>
                    <th className="px-6 py-4 text-center">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedPlayers.map((player) => (
                    <tr 
                      key={player.username} 
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => goToPlayerProfile(player.username)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-xl">
                          #{player.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-medium block">{player.username}</span>
                          <span className="text-sm text-gray-400">{regions.find(r => r.id === player.region)?.name.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium">{player.lp}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-medium ${
                          player.winRate > 55 ? 'text-green-400' :
                          player.winRate < 45 ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {player.winRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400">
                        {player.gamesPlayed}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {getTrendIcon(player.trend)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}