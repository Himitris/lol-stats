// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Champions } from './pages/Champions';
import { Analysis } from './pages/Analysis';
import { Rankings } from './pages/Rankings';
import { Dashboard } from './pages/Dashboard';
import { ApiProvider } from './contexts/ApiContext';
import { ApiKeyError } from './components/LoadingErrorStates';

// Configure the query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <AppContent />
      </ApiProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Nous utilisons un composant séparé pour pouvoir accéder au contexte API
  const isApiKeyConfigured = !!import.meta.env.VITE_RIOT_API_KEY;
  
  if (!isApiKeyConfigured) {
    return <ApiKeyError />;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/summoner/:region/:name" element={<Analysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;