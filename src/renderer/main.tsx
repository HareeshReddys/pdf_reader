import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OverlayView from './components/OverlayView';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {new URLSearchParams(window.location.search).get('view') === 'overlay' ? <OverlayView /> : <App />}
  </React.StrictMode>,
);
