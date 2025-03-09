import React, { useState } from 'react';
import { Search, Sword, Shield, Target, Timer, TrendingUp, Users, ChevronDown, ArrowUp, ArrowDown, ExternalLink, Copy } from 'lucide-react';
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '../lib/utils';

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

const radarData = [
  { stat: 'KDA', value: 75, fullMark: 100 },
  { stat: 'CS', value: 82, fullMark: 100 },
  { stat: 'Damage', value: 90, fullMark: 100 },
  { stat: 'Gold', value: 70, fullMark: 100 },
  { stat: 'Vision', value: 60, fullMark: 100 },
  { stat: 'Objective', value: 85, fullMark: 100 },
];

export function Analysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const getResultColor = (result: 'victory' | 'defeat') => {
    return result === 'victory' ? 'from-green-900/30 to-green-700/10' : 'from-red-900/30 to-red-700/10';
  };

  const getResultTextColor = (result: 'victory' | 'defeat') => {
    return result === 'victory' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Analyse de Performances
        </h1>
        <div className="relative">
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
        </div>
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
            <div className="text-green-400 text-2xl font-bold">62.5%</div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>40 parties jouées</span>
            <span className="flex items-center text-green-400">
              <ArrowUp className="h-4 w-4 mr-1" />
              +4.2%
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
            <div className="text-blue-400 text-2xl font-bold">4.81</div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>8.4 / 3.3 / 7.4</span>
            <span className="flex items-center text-green-400">
              <ArrowUp className="h-4 w-4 mr-1" />
              +0.65
            </span>
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
            <div className="text-white text-xl font-bold">Yasuo</div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>15 parties</span>
            <span className="text-green-400">67% WR</span>
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
                <Tooltip
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
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
              </RadarChart>
            </ResponsiveContainer>
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
              {mockMatches.map(match => (
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

      {/* Trends Chart */}
      <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Tendances sur les dernières parties</h2>
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
              <Line type="monotone" dataKey="kda" stroke="#0AC8B9" name="KDA" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cs" stroke="#F59E0B" name="CS" />
              <Line type="monotone" dataKey="damage" stroke="#EF4444" name="Damage" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}