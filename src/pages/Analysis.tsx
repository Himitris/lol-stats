import React, { useState } from 'react';
import { Search, Sword, Shield, Target, Timer, TrendingUp, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

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

const mockMatches: MatchData[] = [
  {
    id: '1',
    champion: 'Yasuo',
    result: 'victory',
    kills: 12,
    deaths: 4,
    assists: 8,
    kda: 5,
    cs: 245,
    gold: 14500,
    damage: 25400,
    vision: 15,
    duration: '32:15',
    timestamp: '2024-03-15T14:30:00',
    role: 'MID'
  },
  {
    id: '2',
    champion: 'Ahri',
    result: 'defeat',
    kills: 5,
    deaths: 7,
    assists: 12,
    kda: 2.43,
    cs: 198,
    gold: 11200,
    damage: 18900,
    vision: 22,
    duration: '28:45',
    timestamp: '2024-03-15T13:15:00',
    role: 'MID'
  },
  {
    id: '3',
    champion: 'Zed',
    result: 'victory',
    kills: 15,
    deaths: 3,
    assists: 6,
    kda: 7,
    cs: 220,
    gold: 15800,
    damage: 28500,
    vision: 12,
    duration: '35:20',
    timestamp: '2024-03-15T11:45:00',
    role: 'MID'
  }
];

const performanceData = [
  { name: 'KDA', value: 4.81, avg: 3.2 },
  { name: 'CS/min', value: 7.2, avg: 6.5 },
  { name: 'Vision/min', value: 0.8, avg: 0.6 },
  { name: 'DMG/min', value: 850, avg: 720 }
];

const trendData = [
  { game: 1, kda: 5, cs: 245, damage: 25400 },
  { game: 2, kda: 2.43, cs: 198, damage: 18900 },
  { game: 3, kda: 7, cs: 220, damage: 28500 }
];

export function Analysis() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold">Analyse de Parties</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un invocateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Comparée</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Bar dataKey="value" fill="#0AC8B9" name="Vous" />
                <Bar dataKey="avg" fill="#4B5563" name="Moyenne du rang" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tendances sur les 10 dernières parties</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="game" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Line type="monotone" dataKey="kda" stroke="#0AC8B9" name="KDA" />
                <Line type="monotone" dataKey="cs" stroke="#F59E0B" name="CS" />
                <Line type="monotone" dataKey="damage" stroke="#EF4444" name="Damage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-700">Historique des Parties</h2>
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
              {mockMatches.map(match => (
                <tr
                  key={match.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                    match.result === 'victory' ? 'bg-green-900/10' : 'bg-red-900/10'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${match.champion}.png`}
                        alt={match.champion}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div>
                        <span className="font-medium block">{match.champion}</span>
                        <span className="text-sm text-gray-400">{match.role}</span>
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
                      {(match.cs / (parseInt(match.duration) / 60)).toFixed(1)} CS/min
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
                    {new Date(match.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}