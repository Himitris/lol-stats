// src/pages/Analysis.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Sword, Shield, Target, Timer, TrendingUp, Users, ChevronDown, ArrowUp, ArrowDown, ExternalLink, InfoIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '../lib/utils';
import { useApi } from '../contexts/ApiContext';
import { useSummoner, useLeagueEntries, usePlayerMatchHistory } from '../hooks/useRiotApi';
import { LoadingState, ErrorState, ApiKeyError, NoResults } from '../components/LoadingErrorStates';

interface MatchData {
  id: string;
  champion: string;
  result: 'victory' | 'defeat';
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  gold: number;
  damage: number;
  vision: number;
  duration: string;
  timestamp: string;
  role: string;
}

export function Analysis() {
  const navigate = useNavigate();
  const { region: regionParam, name: nameParam } = useParams<{ region?: string, name?: string }>();
  const { selectedRegion, setSelectedRegion, addRecentSearch } = useApi();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  // Utiliser les paramètres d'URL s'ils existent, sinon utiliser l'état global
  const region = regionParam || selectedRegion;
  const summonerName = nameParam ? decodeURIComponent(nameParam) : '';
  
  // Mettre à jour la région sélectionnée si elle est différente dans l'URL
  useEffect(() => {
    if (regionParam && regionParam !== selectedRegion) {
      setSelectedRegion(regionParam);
    }
  }, [regionParam, selectedRegion, setSelectedRegion]);
  
  // Effectuer une recherche lorsque le formulaire est soumis
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      navigate(`/summoner/${region}/${encodeURIComponent(searchQuery)}`);
    }
  };

  // Récupérer les informations de l'invocateur
  const { 
    data: summoner, 
    isLoading: isLoadingSummoner, 
    error: summonerError 
  } = useSummoner(summonerName, region);

  // Récupérer les entrées de ligue de l'invocateur
  const { 
    data: leagueEntries, 
    isLoading: isLoadingLeagueEntries 
  } = useLeagueEntries(summoner?.id, region);

  // Récupérer l'historique des matchs de l'invocateur
  const { 
    data: matchHistory, 
    isLoading: isLoadingMatchHistory, 
    error: matchHistoryError 
  } = usePlayerMatchHistory(summoner?.puuid, region);

  // Préparer les données pour le graphique radar
  const radarData = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return [];
    
    // Des calculs fictifs qui seraient normalement basés sur des données réelles
    return [
      { stat: 'KDA', value: 75, fullMark: 100 },
      { stat: 'CS', value: 82, fullMark: 100 },
      { stat: 'Damage', value: 90, fullMark: 100 },
      { stat: 'Gold', value: 70, fullMark: 100 },
      { stat: 'Vision', value: 60, fullMark: 100 },
      { stat: 'Objective', value: 85, fullMark: 100 },
    ];
  }, [matchHistory]);

  // Calculer les données de performance comparées
  const performanceData = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return [];
    
    // Calcul de KDA moyen
    const totalKills = matchHistory.reduce((sum, match) => sum + match.kills, 0);
    const totalDeaths = matchHistory.reduce((sum, match) => sum + match.deaths, 0);
    const totalAssists = matchHistory.reduce((sum, match) => sum + match.assists, 0);
    const avgKda = totalDeaths === 0 ? 
      (totalKills + totalAssists) : 
      parseFloat(((totalKills + totalAssists) / totalDeaths).toFixed(2));
    
    // Calcul des CS par minute
    const totalCs = matchHistory.reduce((sum, match) => {
      const [minutes, seconds] = match.duration.split(':').map(Number);
      const durationInMinutes = minutes + seconds / 60;
      return sum + (match.cs / durationInMinutes);
    }, 0);
    const avgCsPerMin = parseFloat((totalCs / matchHistory.length).toFixed(1));
    
    // Calcul de la vision par minute
    const totalVision = matchHistory.reduce((sum, match) => {
      const [minutes, seconds] = match.duration.split(':').map(Number);
      const durationInMinutes = minutes + seconds / 60;
      return sum + (match.vision / durationInMinutes);
    }, 0);
    const avgVisionPerMin = parseFloat((totalVision / matchHistory.length).toFixed(1));
    
    // Calcul des dommages par minute
    const totalDamage = matchHistory.reduce((sum, match) => {
      const [minutes, seconds] = match.duration.split(':').map(Number);
      const durationInMinutes = minutes + seconds / 60;
      return sum + (match.damage / durationInMinutes);
    }, 0);
    const avgDamagePerMin = parseFloat((totalDamage / matchHistory.length).toFixed(0));
    
    // Moyennes fictives pour comparaison (seraient normalement basées sur des données d'API)
    return [
      { name: 'KDA', value: avgKda, avg: 3.2 },
      { name: 'CS/min', value: avgCsPerMin, avg: 6.5 },
      { name: 'Vision/min', value: avgVisionPerMin, avg: 0.6 },
      { name: 'DMG/min', value: avgDamagePerMin, avg: 720 }
    ];
  }, [matchHistory]);

  // Préparer les données pour le graphique des tendances
  const trendData = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return [];
    
    return matchHistory.slice(0, 10).map((match, index) => ({
      game: matchHistory.length - index,
      kda: match.kda,
      cs: match.cs,
      damage: match.damage / 1000 // Diviser par 1000 pour une meilleure échelle
    })).reverse();
  }, [matchHistory]);

  // Calculer le taux de victoire et les statistiques globales
  const stats = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) {
      return {
        winRate: 0,
        totalGames: 0,
        kdaAvg: 0,
        favoriteChamp: ''
      };
    }
    
    const victories = matchHistory.filter(match => match.result === 'victory').length;
    const winRate = parseFloat(((victories / matchHistory.length) * 100).toFixed(1));
    
    const totalKills = matchHistory.reduce((sum, match) => sum + match.kills, 0);
    const totalDeaths = matchHistory.reduce((sum, match) => sum + match.deaths, 0);
    const totalAssists = matchHistory.reduce((sum, match) => sum + match.assists, 0);
    
    const kdaAvg = totalDeaths === 0 ? 
      (totalKills + totalAssists) : 
      parseFloat(((totalKills + totalAssists) / totalDeaths).toFixed(2));
    
    // Trouver le champion le plus joué
    const champCount: Record<string, number> = {};
    matchHistory.forEach(match => {
      champCount[match.champion] = (champCount[match.champion] || 0) + 1;
    });
    
    let favoriteChamp = '';
    let maxCount = 0;
    for (const [champ, count] of Object.entries(champCount)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteChamp = champ;
      }
    }
    
    // Calculer le winrate du champion favori
    const favChampMatches = matchHistory.filter(match => match.champion === favoriteChamp);
    const favChampVictories = favChampMatches.filter(match => match.result === 'victory').length;
    const favChampWinRate = parseFloat(((favChampVictories / favChampMatches.length) * 100).toFixed(1));
    
    return {
      winRate,
      totalGames: matchHistory.length,
      kdaAvg,
      favoriteChamp,
      favChampMatches: favChampMatches.length,
      favChampWinRate
    };
  }, [matchHistory]);

  const getResultColor = (result: 'victory' | 'defeat') => {
    return result === 'victory' ? 'from-green-900/30 to-green-700/10' : 'from-red-900/30 to-red-700/10';
  };

  const getResultTextColor = (result: 'victory' | 'defeat') => {
    return result === 'victory' ? 'text-green-400' : 'text-red-400';
  };

  // Si aucun invocateur n'est spécifié, afficher la page de recherche
  if (!nameParam) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Analyse de Performances
          </h1>
          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un invocateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="hidden">Rechercher</button>
          </form>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-lg">
            <Search className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Recherchez un invocateur</h2>
            <p className="text-gray-400 mb-6">
              Entrez le nom d'un invocateur pour voir ses statistiques et son historique de parties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'état de chargement
  if (isLoadingSummoner || (isLoadingMatchHistory && !matchHistoryError)) {
    return <LoadingState message={`Chargement des données pour ${summonerName}...`} />;
  }

  // Afficher l'état d'erreur pour l'invocateur
  if (summonerError) {
    return <ErrorState message={`Invocateur "${summonerName}" introuvable dans la région ${region}`} />;
  }

  // Afficher l'état d'erreur pour l'historique des matchs
  if (matchHistoryError) {
    return <ErrorState message="Impossible de charger l'historique des matchs" />;
  }

  // Si on a l'invocateur mais pas d'historique de matchs
  if (summoner && (!matchHistory || matchHistory.length === 0)) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {summoner.name}
          </h1>
          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un invocateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="hidden">Rechercher</button>
          </form>
        </div>
        <NoResults message="Aucun match récent trouvé pour cet invocateur" />
      </div>
    );
  }

  // Afficher l'analyse complète
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          {summoner?.name || summonerName}
        </h1>
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un invocateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="hidden">Rechercher</button>
        </form>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Win Rate</h2>
            </div>
            <div className={stats.winRate >= 50 ? "text-green-400 text-2xl font-bold" : "text-red-400 text-2xl font-bold"}>
              {stats.winRate}%
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>{stats.totalGames} parties jouées</span>
            <span className="flex items-center text-gray-400">
              {leagueEntries && leagueEntries.length > 0 ? (
                `${leagueEntries[0].tier} ${leagueEntries[0].rank}`
              ) : (
                "Non classé"
              )}
            </span>
          </div>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <Sword className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">KDA Moyen</h2>
            </div>
            <div className="text-blue-400 text-2xl font-bold">{stats.kdaAvg}</div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            {matchHistory && matchHistory.length > 0 && (
              <span>
                {(matchHistory.reduce((sum, match) => sum + match.kills, 0) / matchHistory.length).toFixed(1)} / 
                {(matchHistory.reduce((sum, match) => sum + match.deaths, 0) / matchHistory.length).toFixed(1)} / 
                {(matchHistory.reduce((sum, match) => sum + match.assists, 0) / matchHistory.length).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Champion Préféré</h2>
            </div>
            <div className="text-white text-xl font-bold">{stats.favoriteChamp || "N/A"}</div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            {stats.favoriteChamp && (
              <>
                <span>{stats.favChampMatches} parties</span>
                <span className={stats.favChampWinRate >= 50 ? "text-green-400" : "text-red-400"}>
                  {stats.favChampWinRate}% WR
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Performance Comparée</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                />
                <Bar dataKey="value" fill="#0AC8B9" name="Vous" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" fill="#4B5563" name="Moyenne du rang" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Graphique des Compétences</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#4B5563" />
                <PolarAngleAxis dataKey="stat" stroke="#9CA3AF" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
                <Radar name="Compétences" dataKey="value" stroke="#0AC8B9" fill="#0AC8B9" fillOpacity={0.2} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-400">Note: Les valeurs sont calculées relativement à votre niveau de jeu</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Historique des Parties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left">Champion</th>
                <th className="px-6 py-4 text-center">KDA</th>
                <th className="px-6 py-4 text-center">CS</th>
                <th className="px-6 py-4 text-center">Damage</th>
                <th className="px-6 py-4 text-center">Vision</th>
                <th className="px-6 py-4 text-center">Durée</th>
                <th className="px-6 py-4 text-right">Il y a</th>
              </tr>
            </thead>
            <tbody>
              {matchHistory && matchHistory.map(match => (
                <tr
                  key={match.id}
                  onClick={() => setSelectedMatchId(selectedMatchId === match.id ? null : match.id)}
                  className={cn(
                    "border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors cursor-pointer",
                    selectedMatchId === match.id ? "bg-gray-700/50" : `bg-gradient-to-r ${getResultColor(match.result)}`
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg border-2 border-gray-700 overflow-hidden">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${match.champion}.png`}
                          alt={match.champion}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium block">{match.champion}</span>
                        <span className={cn("text-sm", getResultTextColor(match.result))}>
                          {match.result === 'victory' ? 'Victoire' : 'Défaite'} • {match.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">
                      {match.kills}/{match.deaths}/{match.assists}
                    </span>
                    <span className="text-sm text-gray-400 block">
                      {match.kda.toFixed(2)} KDA
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{match.cs}</span>
                    <span className="text-sm text-gray-400 block">
                      {(() => {
                        const [minutes, seconds] = match.duration.split(':').map(Number);
                        const totalMinutes = minutes + seconds / 60;
                        return (match.cs / totalMinutes).toFixed(1);
                      })()} CS/min
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{match.damage.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{match.vision}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {match.duration}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {(() => {
                      const date = new Date(match.timestamp);
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffMins = Math.floor(diffMs / (1000 * 60));
                      const diffHours = Math.floor(diffMins / 60);
                      const diffDays = Math.floor(diffHours / 24);
                      
                      if (diffDays > 0) {
                        return `${diffDays}j`;
                      } else if (diffHours > 0) {
                        return `${diffHours}h`;
                      } else {
                        return `${diffMins}m`;
                      }
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Tendances sur les dernières parties</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="game" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Line type="monotone" dataKey="kda" stroke="#0AC8B9" name="KDA" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cs" stroke="#F59E0B" name="CS" />
              <Line type="monotone" dataKey="damage" stroke="#EF4444" name="Damage (k)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}