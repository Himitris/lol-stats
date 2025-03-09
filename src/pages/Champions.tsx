import React, { useState } from 'react';
import { Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';

type Role = 'ALL' | 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
type SortKey = 'winrate' | 'pickrate' | 'banrate';

interface ChampionStats {
  id: string;
  name: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  roles: Role[];
}

const mockChampions: ChampionStats[] = [
  {
    id: 'Yasuo',
    name: 'Yasuo',
    winRate: 49.5,
    pickRate: 12.3,
    banRate: 15.7,
    roles: ['MID', 'TOP']
  },
  {
    id: 'Ahri',
    name: 'Ahri',
    winRate: 51.2,
    pickRate: 8.5,
    banRate: 4.2,
    roles: ['MID']
  },
  {
    id: 'Leona',
    name: 'Leona',
    winRate: 52.8,
    pickRate: 7.9,
    banRate: 3.5,
    roles: ['SUPPORT']
  }
];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-3xl font-bold">Statistiques des Champions</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un champion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRole === role
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left">Champion</th>
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
                <tr key={champion.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${champion.id}.png`}
                        alt={champion.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <span className="font-medium">{champion.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-medium ${
                      champion.winRate > 51 ? 'text-green-400' :
                      champion.winRate < 49 ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {champion.winRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {champion.pickRate}%
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {champion.banRate}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {champion.roles.map(role => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-gray-700 rounded text-xs font-medium"
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