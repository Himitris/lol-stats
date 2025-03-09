import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { regions } from '../lib/utils';

export function Home() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0].id);
  const [summonerName, setSummonerName] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Rechercher un invocateur</h1>
        <p className="text-gray-400">
          Entrez le nom d'invocateur pour voir les statistiques détaillées
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex flex-col md:flex-row gap-4">
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

          <div className="flex-1 relative">
            <input
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="Nom d'invocateur..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => {/* TODO: Implement search */}}
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Top Joueurs</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2 text-gray-400">
                  <span className="font-mono">{i}.</span>
                  <span>Faker</span>
                  <span className="ml-auto">1400 LP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Champions Meta</h3>
            <div className="space-y-2">
              {['Kai\'Sa', 'Yasuo', 'Zed'].map((champion) => (
                <div key={champion} className="flex items-center space-x-2 text-gray-400">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${champion}.png`}
                    alt={champion}
                    className="w-8 h-8 rounded"
                  />
                  <span>{champion}</span>
                  <span className="ml-auto">54% WR</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Dernières Recherches</h3>
            <div className="space-y-2">
              {['Rekkles', 'Caps', 'Jankos'].map((name) => (
                <div key={name} className="flex items-center space-x-2 text-gray-400 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <span>{name}</span>
                  <span className="ml-auto text-sm">EUW</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}