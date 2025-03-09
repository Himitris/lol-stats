import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { regions } from '../lib/utils';

interface RankedPlayer {
  rank: number;
  username: string;
  region: string;
  tier: string;
  lp: number;
  winRate: number;
  gamesPlayed: number;
  trend: 'up' | 'down' | 'stable';
}

const mockPlayers: RankedPlayer[] = [
  {
    rank: 1,
    username: "T1 Faker",
    region: "KR",
    tier: "Challenger",
    lp: 1456,
    winRate: 65.4,
    gamesPlayed: 842,
    trend: 'up'
  },
  {
    rank: 2,
    username: "RNG Xiaohu",
    region: "KR",
    tier: "Challenger",
    lp: 1398,
    winRate: 62.8,
    gamesPlayed: 756,
    trend: 'stable'
  },
  {
    rank: 3,
    username: "DK ShowMaker",
    region: "KR",
    tier: "Challenger",
    lp: 1387,
    winRate: 61.2,
    gamesPlayed: 689,
    trend: 'down'
  }
];

export function Rankings() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const getTrendIcon = (trend: RankedPlayer['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classement</h1>
          <p className="text-gray-400 mt-2">Les meilleurs joueurs par région</p>
        </div>
        <div className="flex gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 col-span-full">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold">Top Challenger</h2>
          </div>
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
                {mockPlayers.map((player) => (
                  <tr key={player.username} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-xl">
                        #{player.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium block">{player.username}</span>
                        <span className="text-sm text-gray-400">{player.region}</span>
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
        </div>
      </div>
    </div>
  );
}