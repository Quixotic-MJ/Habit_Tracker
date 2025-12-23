import './bootstrap.js';
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
        </div>
    );
}

const container = document.getElementById('app');
createRoot(container).render(<App />);
