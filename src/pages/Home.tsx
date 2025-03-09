import React, { useState } from 'react';
import { Search, ChevronRight, Sword, TrendingUp, BarChart } from 'lucide-react';
import { regions } from '../lib/utils';

export function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0].id);
  const [summonerName, setSummonerName] = useState('');

  const recentSearches = ['Rekkles', 'Caps', 'Jankos'];
  const metaChampions = [
    { name: 'Kai\'Sa', winRate: 54.2, change: 2.5 },
    { name: 'Yasuo', winRate: 52.7, change: 1.8 },
    { name: 'Zed', winRate: 53.5, change: -0.7 }
  ];
  const topPlayers = [
    { name: 'T1 Faker', lp: 1400, rank: 1 },
    { name: 'DWG ShowMaker', lp: 1356, rank: 2 },
    { name: 'GenG Chovy', lp: 1312, rank: 3 }
  ];

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
        <div className="flex flex-col md:flex-row gap-4 p-1">
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
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {/* TODO: Implement search */}}
            >
              <div className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg flex items-center justify-center p-2">
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Top Joueurs</h3>
            </div>
            <div className="space-y-3">
              {topPlayers.map((player, i) => (
                <div key={i} className="flex items-center space-x-3 bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/80 transition-colors">
                  <span className="font-mono font-bold text-blue-400 w-6">#{player.rank}</span>
                  <span className="text-white">{player.name}</span>
                  <span className="ml-auto text-gray-400">{player.lp} LP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <Sword className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Champions Meta</h3>
            </div>
            <div className="space-y-3">
              {metaChampions.map((champion) => (
                <div key={champion.name} className="flex items-center space-x-3 bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${champion.name}.png`}
                      alt={champion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white">{champion.name}</span>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="text-green-400 font-medium">{champion.winRate}%</span>
                    <span className={champion.change > 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                      {champion.change > 0 ? '+' : ''}{champion.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-900 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-all">
                <BarChart className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Dernières Recherches</h3>
            </div>
            <div className="space-y-3">
              {recentSearches.map((name) => (
                <div key={name} className="flex items-center space-x-3 bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/80 transition-colors cursor-pointer group/item">
                  <span className="text-white group-hover/item:text-blue-400 transition-colors">{name}</span>
                  <span className="ml-auto text-sm text-gray-400">EUW</span>
                  <ChevronRight className="h-4 w-4 text-gray-500 group-hover/item:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}