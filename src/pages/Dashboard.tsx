import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Trophy, Target, TrendingUp, Clock, Star } from 'lucide-react';

const performanceData = [
  { date: '2024-03-10', winRate: 55, rank: 'Gold I', lp: 75 },
  { date: '2024-03-11', winRate: 58, rank: 'Gold I', lp: 89 },
  { date: '2024-03-12', winRate: 54, rank: 'Gold I', lp: 65 },
  { date: '2024-03-13', winRate: 60, rank: 'Gold I', lp: 95 },
  { date: '2024-03-14', winRate: 62, rank: 'Platinum IV', lp: 15 },
  { date: '2024-03-15', winRate: 59, rank: 'Platinum IV', lp: 42 },
];

const favoriteChampions = [
  { name: 'Yasuo', games: 156, winRate: 58, kda: 2.8 },
  { name: 'Zed', games: 124, winRate: 55, kda: 3.1 },
  { name: 'Ahri', games: 98, winRate: 62, kda: 3.5 },
];

const trackedPlayers = [
  { name: 'Friend1', rank: 'Diamond II', lp: 45, status: 'online' },
  { name: 'Friend2', rank: 'Platinum I', lp: 89, status: 'offline' },
  { name: 'Friend3', rank: 'Diamond IV', lp: 12, status: 'in-game' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-gray-400 mt-2">Aperçu de vos performances et statistiques</p>
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
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Joueurs Suivis</h2>
          </div>
          <div className="space-y-4">
            {trackedPlayers.map(player => (
              <div key={player.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
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