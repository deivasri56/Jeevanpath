import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer 
} from 'recharts';

const COURSE_MIX_DATA = [
  { name: 'PMKVY Electrician', value: 4500 },
  { name: 'ITI Plumber', value: 3200 },
  { name: 'DDU-GKY Tailor', value: 2800 },
  { name: 'Solar Tech Bridge', value: 1200 },
  { name: 'Masonry Basic', value: 750 },
];

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

const TOP_JOBS_DATA = [
  { name: 'Electrician', demand: 4500, placed: 1200 },
  { name: 'Tailor', demand: 3800, placed: 1500 },
  { name: 'Plumber', demand: 3200, placed: 800 },
  { name: 'Solar Tech', demand: 2100, placed: 400 },
  { name: 'Welder', demand: 1800, placed: 500 },
];

export const Charts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Recommended Bridge Courses Mix</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COURSE_MIX_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COURSE_MIX_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip 
                  formatter={(value) => [`${value} seekers`, 'Demand']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <PieLegend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Job Demand vs. Placement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_JOBS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <BarTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="demand" name="Total Demand" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed / In-Training" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
