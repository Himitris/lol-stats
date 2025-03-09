import React, { useState } from 'react';
import { Search, Filter, ArrowDown, ArrowUp, BarChart2, Percent, Users } from 'lucide-react';
import { cn } from '../lib/utils';

type Role = 'ALL' | 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
type SortKey = 'winrate' | 'pickrate' | 'banrate';

interface ChampionStats {
  id: string;
  name: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  roles: Role[];
  tier?: 'S' | 'A' | 'B' | 'C' | 'D';
}

const mockChampions: ChampionStats[] = [
  {
    id: 'Yasuo',
    name: 'Yasuo',
    winRate: 49.5,
    pickRate: 12.3,
    banRate: 15.7,
    roles: ['MID', 'TOP'],
    tier: 'A'
  },
  {
    id: 'Ahri',
    name: 'Ahri',
    winRate: 51.2,
    pickRate: 8.5,
    banRate: 4.2,
    roles: ['MID'],
    tier: 'S'
  },
  {
    id: 'Leona',
    name: 'Leona',
    winRate: 52.8,
    pickRate: 7.9,
    banRate: 3.5,
    roles: ['SUPPORT'],
    tier: 'S'
  },
  {
    id: 'Darius',
    name: 'Darius',
    winRate: 50.4,
    pickRate: 9.7,
    banRate: 8.2,
    roles: ['TOP'],
    tier: 'A'
  },
  {
    id: 'LeeSin',
    name: 'Lee Sin',
    winRate: 48.6,
    pickRate: 11.5,
    banRate: 6.1,
    roles: ['JUNGLE'],
    tier: 'B'
  },
  {
    id: 'Jinx',
    name: 'Jinx',
    winRate: 53.1,
    pickRate: 10.2,
    banRate: 5.4,
    roles: ['ADC'],
    tier: 'S'
  }
];

const getTierColor = (tier?: string) => {
  switch (tier) {
    case 'S': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    case 'A': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'B': return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'C': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'D': return 'text-red-400 bg-red-400/10 border-red-400/30';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
};

const getWinRateColor = (winRate: number) => {
  if (winRate >= 52) return 'text-green-400';
  if (winRate <= 48) return 'text-red-400';
  return 'text-yellow-400';
};

export function Champions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('winrate');
  const [sortDesc, setSortDesc] = useState(true);

  const roles: Role[] = ['ALL', 'TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

  const filteredChampions = mockChampions
    .filter(champion => 
      champion.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedRole === 'ALL' || champion.roles.includes(selectedRole))
    )
    .sort((a, b) => {
      const getValue = (champion: ChampionStats) => {
        switch (sortKey) {
          case 'winrate': return champion.winRate;
          case 'pickrate': return champion.pickRate;
          case 'banrate': return champion.banRate;
        }
      };
      return sortDesc ? getValue(b) - getValue(a) : getValue(a) - getValue(b);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const RateDisplay = ({ 
    value, 
    icon, 
    colorClass 
  }: { 
    value: number; 
    icon: React.ReactNode; 
    colorClass: string 
  }) => (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className={colorClass}>{value.toFixed(1)}%</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Statistiques des Champions
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un champion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-4">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              selectedRole === role
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200 border border-gray-700"
            )}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="bg-gray-800/40 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="px-6 py-4 text-left">Champion</th>
                <th className="px-6 py-4 text-center">Tier</th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('winrate')}
                    className="flex items-center space-x-1 mx-auto"
                  >
                    <span>Win Rate</span>
                    {sortKey === 'winrate' && (
                      sortDesc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('pickrate')}
                    className="flex items-center space-x-1 mx-auto"
                  >
                    <span>Pick Rate</span>
                    {sortKey === 'pickrate' && (
                      sortDesc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('banrate')}
                    className="flex items-center space-x-1 mx-auto"
                  >
                    <span>Ban Rate</span>
                    {sortKey === 'banrate' && (
                      sortDesc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">Roles</th>
              </tr>
            </thead>
            <tbody>
              {filteredChampions.map(champion => (
                <tr key={champion.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg border-2 border-gray-700 overflow-hidden transform hover:scale-110 transition-transform duration-200 hover:border-blue-500">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${champion.id}.png`}
                          alt={champion.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-lg">{champion.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {champion.tier && (
                      <span className={cn(
                        "inline-block w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center border",
                        getTierColor(champion.tier)
                      )}>
                        {champion.tier}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <RateDisplay 
                      value={champion.winRate} 
                      icon={<BarChart2 className="h-4 w-4 text-gray-400" />} 
                      colorClass={getWinRateColor(champion.winRate)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <RateDisplay 
                      value={champion.pickRate} 
                      icon={<Users className="h-4 w-4 text-gray-400" />} 
                      colorClass="text-blue-400"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <RateDisplay 
                      value={champion.banRate} 
                      icon={<Percent className="h-4 w-4 text-gray-400" />} 
                      colorClass="text-orange-400"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {champion.roles.map(role => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-gray-700/50 backdrop-blur-sm rounded text-xs font-medium border border-gray-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
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