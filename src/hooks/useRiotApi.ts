// src/hooks/useRiotApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Summoner, LeagueEntry, MatchSummary, Champion, ChampionStats } from '../services/api';
import React from 'react';

// Hook pour vérifier si la clé API est valide
export function useApiKeyValidation() {
  return useQuery({
    queryKey: ['apiKeyValidation'],
    queryFn: () => apiService.isApiKeyValid(),
    staleTime: Infinity, // La validité de la clé API ne change pas souvent
    retry: false, // Ne pas réessayer si la clé est invalide
  });
}

// Hook pour récupérer un invocateur par son nom
export function useSummoner(summonerName: string, region: string) {
  return useQuery({
    queryKey: ['summoner', summonerName, region],
    queryFn: () => apiService.getSummonerByName(summonerName, region),
    enabled: !!summonerName && !!region && summonerName.length > 0,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les entrées de ligue d'un invocateur
export function useLeagueEntries(summonerId: string | undefined, region: string) {
  return useQuery({
    queryKey: ['leagueEntries', summonerId, region],
    queryFn: () => apiService.getLeagueEntries(summonerId!, region),
    enabled: !!summonerId && !!region,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les joueurs du haut du classement
export function useTopPlayers(queue: string, tier: string, division: string, region: string) {
  return useQuery({
    queryKey: ['topPlayers', queue, tier, division, region],
    queryFn: () => apiService.getLeagueByTierDivision(queue, tier, division, region),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Hook pour récupérer les IDs de match d'un joueur
export function useMatchIds(puuid: string | undefined, region: string, count: number = 20) {
  return useQuery({
    queryKey: ['matchIds', puuid, region, count],
    queryFn: () => apiService.getMatchIdsByPuuid(puuid!, region, count),
    enabled: !!puuid && !!region,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer les détails d'un match
export function useMatch(matchId: string | undefined, region: string) {
  return useQuery({
    queryKey: ['match', matchId, region],
    queryFn: () => apiService.getMatchById(matchId!, region),
    enabled: !!matchId && !!region,
    retry: 1,
    staleTime: Infinity, // Les matches ne changent pas une fois terminés
  });
}

// Hook pour récupérer plusieurs matchs en parallèle
export function useMatches(matchIds: string[] | undefined, region: string) {
  return useQuery({
    queryKey: ['matches', matchIds, region],
    queryFn: async () => {
      if (!matchIds || matchIds.length === 0) return [];
      // Limiter le nombre de requêtes parallèles pour éviter de dépasser les limites de débit
      const matches = [];
      for (const id of matchIds.slice(0, 5)) { // Limiter à 5 matchs pour éviter les problèmes de débit
        try {
          const match = await apiService.getMatchById(id, region);
          matches.push(match);
        } catch (error) {
          console.error(`Erreur lors du chargement du match ${id}:`, error);
          // Continuer avec les autres matchs même si l'un d'eux échoue
        }
      }
      return matches;
    },
    enabled: !!matchIds && matchIds.length > 0 && !!region,
    retry: 1,
    staleTime: Infinity, // Les matches ne changent pas une fois terminés
  });
}

// Hook pour récupérer la version actuelle du jeu
export function useGameVersion() {
  return useQuery({
    queryKey: ['gameVersion'],
    queryFn: () => apiService.getCurrentVersion(),
    staleTime: 24 * 60 * 60 * 1000, // 24 heures
    retry: 3,
  });
}

// Hook pour récupérer tous les champions
export function useChampions(version: string | undefined) {
  return useQuery({
    queryKey: ['champions', version],
    queryFn: () => apiService.getAllChampions(version!),
    enabled: !!version,
    staleTime: 24 * 60 * 60 * 1000, // 24 heures
    retry: 2,
  });
}

// Hook pour récupérer un historique de match formaté pour un joueur avec gestion des erreurs et valeurs nulles
export function usePlayerMatchHistory(puuid: string | undefined, region: string, count: number = 10) {
  const matchIdsQuery = useMatchIds(puuid, region, count);
  const matchIds = matchIdsQuery.data;
  
  const matchesQuery = useMatches(matchIds, region);
  
  // Format des données adaptées à votre UI avec vérifications de nullité
  const formattedMatches = React.useMemo(() => {
    if (!matchesQuery.data || matchesQuery.data.length === 0) return [];
    
    return matchesQuery.data.map((match) => {
      if (!match || !match.info || !match.metadata) return null;
      
      const participant = match.info.participants.find(p => p.puuid === puuid);
      
      if (!participant) return null;
      
      const duration = match.info.gameDuration || 0;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      
      return {
        id: match.metadata.matchId || '',
        champion: participant.championName || 'Unknown',
        result: participant.win ? 'victory' : 'defeat',
        kills: participant.kills || 0,
        deaths: participant.deaths || 0,
        assists: participant.assists || 0,
        kda: participant.deaths === 0 
          ? (participant.kills + participant.assists) 
          : ((participant.kills + participant.assists) / participant.deaths),
        cs: participant.totalMinionsKilled || 0,
        gold: participant.goldEarned || 0,
        damage: participant.totalDamageDealtToChampions || 0,
        vision: participant.visionScore || 0,
        duration: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
        timestamp: new Date(match.info.gameEndTimestamp || Date.now()).toISOString(),
        role: participant.lane || 'UNKNOWN',
      };
    }).filter(Boolean);
  }, [matchesQuery.data, puuid]);
  
  return {
    ...matchesQuery,
    data: formattedMatches,
    isLoading: matchIdsQuery.isLoading || matchesQuery.isLoading,
    isError: matchIdsQuery.isError || matchesQuery.isError,
    error: matchIdsQuery.error || matchesQuery.error,
  };
}