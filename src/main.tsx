import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/dashboard/Login';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Beneficiary Facing App */}
        <Route path="/*" element={<App />} />
        
        {/* Admin/Planner Dashboard */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
