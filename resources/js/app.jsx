import './bootstrap.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Boot from './pages/boot.jsx';
import Dashboard from './pages/dashboard.jsx';



function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard/>
        </div>
    );
}

const container = document.getElementById('app');
createRoot(container).render(<App />);
