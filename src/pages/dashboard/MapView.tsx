import React from 'react';

// Mock data for Coimbatore region wards
const MOCK_WARDS = [
  { id: 1, name: 'Gandhipuram', lat: 11.0183, lng: 76.9691, demand: 450, color: '#ef4444' }, // Red (High)
  { id: 2, name: 'Peelamedu', lat: 11.0261, lng: 77.0097, demand: 320, color: '#f97316' }, // Orange (Med-High)
  { id: 3, name: 'RS Puram', lat: 11.0083, lng: 76.9498, demand: 120, color: '#22c55e' }, // Green (Low)
  { id: 4, name: 'Ukkadam', lat: 10.9880, lng: 76.9602, demand: 580, color: '#ef4444' }, // Red (High)
  { id: 5, name: 'Thudiyalur', lat: 11.0716, lng: 76.9431, demand: 210, color: '#eab308' }, // Yellow (Med)
];

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHVtbXkiLCJhIjoiY2x4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4In0.dummy'; // Mock token

export const MapView: React.FC = () => {
  return (
    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Job Demand Heatmap - Coimbatore Region</h3>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> High Demand</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Medium Demand</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Low Demand</span>
        </div>
      </div>
      
      <div className="flex-1 relative bg-slate-100">
        {/* If a real token is provided, this Mapbox map will render. Otherwise, it shows an error state by mapbox but we can catch it or let it be for mock purposes. */}
                  <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-600">
            Map placeholder (Mock)
          </div>
        
        {/* Placeholder overlay in case Mapbox token fails */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
           <div className="bg-white/90 backdrop-blur p-4 rounded shadow-lg text-center pointer-events-auto max-w-sm border border-amber-200">
             <p className="text-amber-700 text-sm font-medium">Mapbox token is mock. Wards shown conceptually.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
