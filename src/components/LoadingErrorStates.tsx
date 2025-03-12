// src/components/LoadingErrorStates.tsx
import React from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export function LoadingState({ message = "Chargement des données..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader className="h-10 w-10 text-blue-400 animate-spin mb-4" />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}

interface ErrorProps {
  message: string;
  retryAction?: () => void;
}

export function ErrorState({ message, retryAction }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Erreur</h3>
      <p className="text-gray-400 text-lg mb-6">{message}</p>
      {retryAction && (
        <button 
          onClick={retryAction}
          className="btn-gaming-primary"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

interface ApiKeyErrorProps {
  message?: string;
}

export function ApiKeyError({ message = "Clé API Riot non configurée ou invalide" }: ApiKeyErrorProps) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-6 max-w-2xl mx-auto my-12">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-orange-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Configuration requise</h3>
        <p className="text-gray-300 mb-4">{message}</p>
        
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 w-full mt-4 text-left">
          <h4 className="text-lg font-medium text-white mb-3">Comment configurer votre clé API Riot :</h4>
          <ol className="list-decimal pl-6 space-y-2 text-gray-300">
            <li>Créez un compte développeur sur <a href="https://developer.riotgames.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">developer.riotgames.com</a></li>
            <li>Générez une clé API de développement</li>
            <li>Créez un fichier <code className="bg-gray-800 px-2 py-0.5 rounded">.env</code> à la racine du projet</li>
            <li>Ajoutez votre clé API : <code className="bg-gray-800 px-2 py-0.5 rounded">VITE_RIOT_API_KEY=votre_clé_api</code></li>
            <li>Redémarrez l'application</li>
          </ol>
          <p className="mt-4 text-sm text-gray-400">Note: Les clés de développement expirent après 24 heures. Pour une utilisation en production, vous devrez demander une clé de production à Riot Games.</p>
        </div>
      </div>
    </div>
  );
}

interface NoResultsProps {
  message?: string;
}

export function NoResults({ message = "Aucun résultat trouvé" }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <p className="text-gray-400 text-lg text-center">{message}</p>
    </div>
  );
}