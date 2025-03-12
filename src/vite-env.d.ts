/// <reference types="vite/client" />



interface ImportMetaEnv {
    readonly VITE_RIOT_API_KEY: string;
    // ajoutez d'autres variables d'environnement si nécessaire
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }