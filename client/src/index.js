import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ correct import for React 18+
import App from './App';
import './Simon.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
