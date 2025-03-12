// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Trophy, Target, TrendingUp, Clock, Star, Search, InfoIcon } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { LoadingState, ErrorState, NoResults } from '../components/LoadingErrorStates';
import { useSummoner, useLeagueEntries, usePlayerMatchHistory } from '../hooks/useRiotApi';

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedRegion, recentSearches } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Utiliser le premier invocateur des recherches récentes si disponible
  const defaultSummoner = recentSearches.length > 0 ? recentSearches[0] : '';
  
  // État pour stocker l'invocateur actuellement affiché
  const [currentSummoner, setCurrentSummoner] = useState(defaultSummoner);
  
  // Effectuer une recherche lorsque le formulaire est soumis
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentSummoner(searchQuery);
      setSearchQuery('');
    }
  };
  
  // Récupérer les informations de l'invocateur
  const { 
    data: summoner, 
    isLoading: isLoadingSummoner, 
    error: summonerError 
  } = useSummoner(currentSummoner, selectedRegion);
  
  // Récupérer les entrées de ligue de l'invocateur
  const { 
    data: leagueEntries, 
    isLoading: isLoadingLeagueEntries 
  } = useLeagueEntries(summoner?.id, selectedRegion);
  
  // Récupérer l'historique des matchs de l'invocateur
  const { 
    data: matchHistory, 
    isLoading: isLoadingMatchHistory 
  } = usePlayerMatchHistory(summoner?.puuid, selectedRegion);
  
  // Préparer les données pour le graphique de progression
  const performanceData = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0 || !leagueEntries) return [];
    
    // Trouver l'entrée de ligue solo (si disponible)
    const soloEntry = leagueEntries.find(entry => 
      entry.queueType === 'RANKED_SOLO_5x5'
    );
    
    // Créer des données fictives de progression basées sur les matchs récents
    // Dans une application réelle, ces données viendraient d'une base de données qui suit la progression au fil du temps
    return matchHistory.slice(0, 7).map((match, index) => {
      const date = new Date(match.timestamp);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      const baseLP = soloEntry ? soloEntry.leaguePoints : 50;
      // Simuler des changements de LP basés sur les résultats des matchs
      const lpChange = match.result === 'victory' ? 
        Math.floor(Math.random() * 10) + 15 : 
        -(Math.floor(Math.random() * 10) + 10);
      
      // Calculer le LP fictif pour ce match
      const lpValue = Math.max(0, Math.min(100, baseLP - (matchHistory.length - index) * lpChange));
      
      // Calculer un taux de victoire fictif
      const matchesBeforeThis = matchHistory.slice(index);
      const victories = matchesBeforeThis.filter(m => m.result === 'victory').length;
      const winRate = Math.round((victories / matchesBeforeThis.length) * 100);
      
      return {
        date: dateStr,
        winRate,
        rank: soloEntry ? `${soloEntry.tier} ${soloEntry.rank}` : 'Unranked',
        lp: lpValue
      };
    }).reverse();
  }, [matchHistory, leagueEntries]);
  
  // Préparer les données pour les champions favoris
  const favoriteChampions = React.useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return [];
    
    // Compter les occurrences de chaque champion
    const champCounts: Record<string, { 
      games: number, 
      wins: number, 
      kills: number, 
      deaths: number, 
      assists: number 
    }> = {};
    
    matchHistory.forEach(match => {
      if (!champCounts[match.champion]) {
        champCounts[match.champion] = {
          games: 0,
          wins: 0,
          kills: 0,
          deaths: 0,
          assists: 0
        };
      }
      
      champCounts[match.champion].games += 1;
      if (match.result === 'victory') {
        champCounts[match.champion].wins += 1;
      }
      champCounts[match.champion].kills += match.kills;
      champCounts[match.champion].deaths += match.deaths;
      champCounts[match.champion].assists += match.assists;
    });
    
    // Convertir en tableau et trier par nombre de parties
    return Object.entries(champCounts)
      .map(([name, stats]) => ({
        name,
        games: stats.games,
        winRate: Math.round((stats.wins / stats.games) * 100),
        kda: stats.deaths === 0 ? 
          (stats.kills + stats.assists) : 
          parseFloat(((stats.kills + stats.assists) / stats.deaths).toFixed(1))
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 3); // Prendre les 3 champions les plus joués
  }, [matchHistory]);
  
  // Préparer les données pour les joueurs suivis
  // (Dans une application réelle, ces données viendraient d'une base de données ou d'une API)
  const trackedPlayers = React.useMemo(() => {
    // Utiliser les recherches récentes comme joueurs "suivis"
    return recentSearches.slice(1, 4).map(name => {
      // Générer des données fictives pour ces joueurs
      const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];
      const divisions = ['IV', 'III', 'II', 'I'];
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const randomDivision = divisions[Math.floor(Math.random() * divisions.length)];
      const randomLP = Math.floor(Math.random() * 100);
      const statuses = ['online', 'offline', 'in-game'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        name,
        rank: `${randomRank} ${randomDivision}`,
        lp: randomLP,
        status: randomStatus
      };
    });
  }, [recentSearches]);
  
  // Si aucun invocateur n'est spécifié, afficher un message d'information
  if (!currentSummoner) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-gray-400 mt-2">Aperçu de vos performances et statistiques</p>
        </div>
        
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Aucun invocateur trouvé</h2>
          <p className="text-gray-400 mb-6">
            Recherchez un invocateur pour voir son tableau de bord personnalisé
          </p>
          
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Nom d'invocateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Afficher l'état de chargement
  if (isLoadingSummoner || isLoadingLeagueEntries || isLoadingMatchHistory) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-gray-400 mt-2">Chargement des données pour {currentSummoner}...</p>
        </div>
        
        <LoadingState message={`Chargement des statistiques pour ${currentSummoner}...`} />
      </div>
    );
  }
  
  // Afficher l'état d'erreur
  if (summonerError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="text-gray-400 mt-2">Erreur lors du chargement des données</p>
        </div>
        
        <ErrorState 
          message={`Invocateur "${currentSummoner}" introuvable dans la région ${selectedRegion}`}
          retryAction={() => setCurrentSummoner('')}
        />
        
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Nom d'invocateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>
    );
  }
  
  // Si on n'a pas d'historique de match
  if (!matchHistory || matchHistory.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Tableau de Bord: {summoner?.name}
          </h1>
          <p className="text-gray-400 mt-2">Aperçu de vos performances et statistiques</p>
        </div>
        
        <NoResults message="Aucun match récent trouvé pour cet invocateur" />
        
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher un autre invocateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>
    );
  }

  // Calculer quelques statistiques supplémentaires
  const victories = matchHistory.filter(match => match.result === 'victory').length;
  const winRate = parseFloat(((victories / matchHistory.length) * 100).toFixed(1));
  const totalKills = matchHistory.reduce((sum, match) => sum + match.kills, 0);
  const totalDeaths = matchHistory.reduce((sum, match) => sum + match.deaths, 0);
  const totalAssists = matchHistory.reduce((sum, match) => sum + match.assists, 0);
  const kdaAvg = totalDeaths === 0 ? 
    parseFloat((totalKills + totalAssists).toFixed(1)) : 
    parseFloat(((totalKills + totalAssists) / totalDeaths).toFixed(2));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Tableau de Bord: {summoner?.name}
          </h1>
          <p className="text-gray-400 mt-2">
            Niveau {summoner?.summonerLevel} • 
            {leagueEntries && leagueEntries.length > 0 
              ? ` ${leagueEntries[0].tier} ${leagueEntries[0].rank} • ${leagueEntries[0].leaguePoints} LP`
              : " Non classé"}
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un autre invocateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="hidden">Rechercher</button>
        </form>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 p-4 flex items-center gap-3">
        <InfoIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
        <p className="text-gray-300 text-sm">
          Les données de progression et de rang sont partiellement simulées car l'API Riot ne fournit pas d'historique des changements de LP.
          Dans une application réelle, ces données seraient stockées dans une base de données au fil du temps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Progression du Rang</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Line type="monotone" dataKey="lp" stroke="#0AC8B9" name="LP" />
                <Line type="monotone" dataKey="winRate" stroke="#F59E0B" name="Win Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Star className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold">Champions Favoris</h2>
          </div>
          {favoriteChampions.length > 0 ? (
            <div className="space-y-4">
              {favoriteChampions.map(champion => (
                <div key={champion.name} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${champion.name}.png`}
                    alt={champion.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{champion.name}</span>
                      <span className="text-sm text-gray-400">{champion.games} parties</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-sm ${
                        champion.winRate > 55 ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {champion.winRate}% WR
                      </span>
                      <span className="text-sm text-gray-400">{champion.kda} KDA</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-center text-gray-400">
              Aucun champion favori trouvé
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Joueurs Suivis</h2>
          </div>
          {trackedPlayers.length > 0 ? (
            <div className="space-y-4">
              {trackedPlayers.map(player => (
                <div 
                  key={player.name} 
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setCurrentSummoner(player.name);
                    setSearchQuery('');
                  }}
                >
                  <div>
                    <span className="font-medium block">{player.name}</span>
                    <span className="text-sm text-gray-400">{player.rank} • {player.lp} LP</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    player.status === 'online' ? 'bg-green-400' :
                    player.status === 'in-game' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-10">
              Recherchez d'autres invocateurs pour les suivre
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-semibold">Activité Récente</h2>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar dataKey="winRate" fill="#0AC8B9" name="Win Rate" />
                <Bar dataKey="lp" fill="#F59E0B" name="LP" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}