import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AppProvider } from './state/AppContext';
import { BASENAME } from './lib/base';
import '@fontsource-variable/nunito-sans';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/douglas.css';

// Normalise "/route/" (served from a route folder) to "/route" so the router, titles and breadcrumbs match.
if (/[^/]\/$/.test(window.location.pathname) && window.location.pathname.replace(/\/$/, '') !== BASENAME) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/$/, '') + window.location.search + window.location.hash);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASENAME || '/'}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
