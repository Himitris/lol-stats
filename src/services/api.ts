import { regions } from '../lib/utils';

// Vous devrez remplacer cette clé d'API par la vôtre
const API_KEY = import.meta.env.VITE_RIOT_API_KEY || '';

// Types pour les données
export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
  revisionDate: number;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface MatchSummary {
  metadata: {
    matchId: string;
    participants: string[];
    dataVersion: string;
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: MatchParticipant[];
    platformId: string;
    queueId: number;
    teams: any[];
  };
}

export interface MatchParticipant {
  assists: number;
  championId: number;
  championName: string;
  deaths: number;
  kills: number;
  lane: string;
  participantId: number;
  puuid: string;
  role: string;
  summonerId: string;
  summonerName: string;
  teamId: number;
  totalDamageDealtToChampions: number;
  totalMinionsKilled: number;
  visionScore: number;
  win: boolean;
  // autres champs...
}

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
  };
  // autres champs...
}

export interface ChampionStats {
  id: string;
  name: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  roles: string[];
  tier?: 'S' | 'A' | 'B' | 'C' | 'D';
}

// Configuration des limites de débit
interface RateLimitInfo {
  count: number;
  limit: number;
  resetTime: number;
}
const rateLimits: Record<string, RateLimitInfo> = {};

// URLs de base pour les différentes API selon la documentation Riot
const SUMMONER_API_BASE = (region: string) => 
  `https://${region}.api.riotgames.com/lol/summoner/v4/summoners`;

const LEAGUE_API_BASE = (region: string) => 
  `https://${region}.api.riotgames.com/lol/league/v4`;

const MATCH_API_BASE = (region: string) => 
  `https://${region}.api.riotgames.com/lol/match/v5/matches`;

const ACCOUNT_API_BASE = (region: string) => 
  `https://${getRegionForAccountApi(region)}.api.riotgames.com/riot/account/v1/accounts`;

const CHAMPION_API_BASE = 'https://ddragon.leagueoflegends.com/cdn';

// Convertir une région en région pour l'API de match (différent format)
const getRegionForMatchApi = (region: string) => {
  switch(region) {
    case 'euw1':
    case 'eun1':
      return 'europe';
    case 'na1':
      return 'americas';
    case 'kr':
      return 'asia';
    case 'br1':
      return 'americas';
    case 'la1':
    case 'la2':
      return 'americas';
    case 'oc1':
      return 'sea';
    case 'tr1':
    case 'ru':
      return 'europe';
    case 'jp1':
      return 'asia';
    case 'ph2':
    case 'sg2':
    case 'th2':
    case 'tw2':
    case 'vn2':
      return 'sea';
    default:
      return 'europe';
  }
};

// Convertir une région en région pour l'API de compte
const getRegionForAccountApi = (region: string) => {
  return getRegionForMatchApi(region);
};

// Fonction pour vérifier si l'API key est présente
const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error('API_KEY not found. Please add your Riot API key to .env file as VITE_RIOT_API_KEY');
  }
};

// Fonction pour gérer les erreurs API
const handleApiError = (error: any) => {
  // Gestion spécifique des erreurs de l'API Riot
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        throw new Error('Unauthorized: Invalid API key');
      case 403:
        throw new Error('Forbidden: API key may have expired');
      case 404:
        throw new Error('Resource not found');
      case 429:
        throw new Error('Rate limit exceeded. Try again later');
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error('Server error. Try again later');
      default:
        throw new Error(`API Error: ${error.message}`);
    }
  } else if (error.request) {
    throw new Error('No response received from server');
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};

// Fonction pour gérer les limites de débit
const updateRateLimit = (endpoint: string, response: Response) => {
  const appRateLimit = response.headers.get('X-App-Rate-Limit');
  const appRateLimitCount = response.headers.get('X-App-Rate-Limit-Count');
  const methodRateLimit = response.headers.get('X-Method-Rate-Limit');
  const methodRateLimitCount = response.headers.get('X-Method-Rate-Limit-Count');
  
  if (appRateLimit && appRateLimitCount) {
    const [shortLimit] = appRateLimit.split(',')[0].split(':').map(Number);
    const [shortCount] = appRateLimitCount.split(',')[0].split(':').map(Number);
    
    rateLimits[endpoint] = {
      count: shortCount,
      limit: shortLimit,
      resetTime: Date.now() + 1000 // Approximation simple, dans une app réelle, utilisez les vraies valeurs de reset
    };
    
    // Log pour le debug
    console.log(`Rate limit for ${endpoint}: ${shortCount}/${shortLimit}`);
    
    // Si on est proche de la limite, ajoutez un délai
    if (shortCount > shortLimit * 0.8) {
      console.warn(`Approaching rate limit for ${endpoint}: ${shortCount}/${shortLimit}`);
    }
  }
};

// Fonction pour vérifier si on approche la limite de débit
const checkRateLimit = (endpoint: string) => {
  const rateLimit = rateLimits[endpoint];
  if (rateLimit && rateLimit.count >= rateLimit.limit) {
    const waitTime = rateLimit.resetTime - Date.now();
    if (waitTime > 0) {
      console.warn(`Rate limit reached for ${endpoint}. Waiting ${waitTime}ms...`);
      return new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  return Promise.resolve();
};

// Fetch avec gestion d'erreur standardisée et gestion du débit
const fetchWithErrorHandling = async (url: string, endpoint: string): Promise<any> => {
  try {
    checkApiKey();
    
    // Vérifier si on doit attendre à cause des limites de débit
    await checkRateLimit(endpoint);
    
    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });
    
    // Mettre à jour les infos de limite de débit
    updateRateLimit(endpoint, response);
    
    if (!response.ok) {
      if (response.status === 429) {
        // Si on dépasse la limite, attendre le temps indiqué par Riot avant de réessayer
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 10000;
        
        console.warn(`Rate limit exceeded. Waiting ${waitTime}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Réessayer après avoir attendu
        return fetchWithErrorHandling(url, endpoint);
      }
      
      const error: any = new Error(`HTTP status ${response.status}`);
      error.response = response;
      throw error;
    }
    
    return await response.json();
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error);
    handleApiError(error);
    throw error;
  }
};

// Services d'API
export const apiService = {
  // Récupérer un invocateur par nom
  async getSummonerByName(summonerName: string, region: string): Promise<Summoner> {
    const encodedName = encodeURIComponent(summonerName);
    const url = `${SUMMONER_API_BASE(region)}/by-name/${encodedName}`;
    return await fetchWithErrorHandling(url, 'summoner-by-name');
  },

  // Récupérer un compte Riot par Riot ID (nom + tag)
  async getAccountByRiotId(gameName: string, tagLine: string, region: string): Promise<any> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    const url = `${ACCOUNT_API_BASE(region)}/by-riot-id/${encodedName}/${encodedTag}`;
    return await fetchWithErrorHandling(url, 'account-by-riot-id');
  },

  // Récupérer un invocateur par PUUID
  async getSummonerByPuuid(puuid: string, region: string): Promise<Summoner> {
    const url = `${SUMMONER_API_BASE(region)}/by-puuid/${puuid}`;
    return await fetchWithErrorHandling(url, 'summoner-by-puuid');
  },

  // Récupérer les entrées de ligue pour un invocateur
  async getLeagueEntries(summonerId: string, region: string): Promise<LeagueEntry[]> {
    const url = `${LEAGUE_API_BASE(region)}/entries/by-summoner/${summonerId}`;
    return await fetchWithErrorHandling(url, 'league-entries');
  },

  // Récupérer les entrées de ligue pour un tier et une division spécifiques
  async getLeagueByTierDivision(queue: string, tier: string, division: string, region: string): Promise<LeagueEntry[]> {
    const url = `${LEAGUE_API_BASE(region)}/entries/${queue}/${tier}/${division}`;
    return await fetchWithErrorHandling(url, 'league-tier-division');
  },

  // Récupérer la liste des IDs de match pour un joueur
  async getMatchIdsByPuuid(puuid: string, region: string, count: number = 20): Promise<string[]> {
    const matchRegion = getRegionForMatchApi(region);
    const url = `https://${matchRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
    return await fetchWithErrorHandling(url, 'match-ids');
  },

  // Récupérer les détails d'un match
  async getMatchById(matchId: string, region: string): Promise<MatchSummary> {
    const matchRegion = getRegionForMatchApi(region);
    const url = `https://${matchRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    return await fetchWithErrorHandling(url, 'match-by-id');
  },

  // Récupérer la version actuelle du jeu
  async getCurrentVersion(): Promise<string> {
    try {
      const url = 'https://ddragon.leagueoflegends.com/api/versions.json';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const versions = await response.json();
      return versions[0];
    } catch (error) {
      console.error('Error getting game version:', error);
      return '15.5.1'; // Version par défaut en cas d'erreur
    }
  },

  // Récupérer tous les champions
  async getAllChampions(version: string): Promise<Record<string, Champion>> {
    try {
      const url = `${CHAMPION_API_BASE}/${version}/data/fr_FR/champion.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting champions:', error);
      throw error;
    }
  },

  // Vérifier si une clé API est valide
  async isApiKeyValid(): Promise<boolean> {
    try {
      checkApiKey();
      const region = regions[0].id;
      const url = `https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations`;
      const response = await fetch(url, {
        headers: {
          "X-Riot-Token": API_KEY
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
};