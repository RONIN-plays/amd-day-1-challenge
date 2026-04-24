import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import NutritionRing from '../components/meals/NutritionRing';
import NudgeCard from '../components/nudges/NudgeCard';
import { HiTrendingUp, HiClipboardList, HiLightBulb, HiBell } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FoodSuggestionCard from '../components/recommendations/FoodSuggestionCard';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [t, w, n, r] = await Promise.all([
        api.get('/meals/today'), api.get('/meals/stats/weekly'), api.get('/nudges/active'), api.get('/recommendations')
      ]);
      setToday(t.data);
      setWeekly(w.data.stats || []);
      setNudges(n.data.nudges || []);
      setRecs(r.data.recommendations?.slice(0, 3) || []);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const completeNudge = async (id) => {
    try { await api.post(`/nudges/${id}/complete`); setNudges(nudges.filter(n => n.id !== id)); toast.success('Nudge completed!'); }
    catch { toast.error('Failed'); }
  };

  const dismissRec = async (id) => {
    try { await api.post(`/recommendations/${id}/dismiss`); setRecs(recs.filter(r => r.id !== id)); }
    catch { toast.error('Failed to dismiss'); }
  };

  if (loading) return <div className="page-container flex justify-center pt-20"><Loader size="lg" /></div>;

  const s = today?.summary || {};
  const goal = today?.calorieGoal || 2000;
  const pct = Math.min(Math.round((s.totalCalories / goal) * 100), 100);

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mb-8">Here's your nutrition snapshot for today</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: `${Math.round(s.totalCalories || 0)}`, sub: `/ ${goal} kcal`, icon: HiTrendingUp, color: 'text-primary' },
          { label: 'Meals Today', value: s.mealCount || 0, sub: 'logged', icon: HiClipboardList, color: 'text-secondary' },
          { label: 'Protein', value: `${Math.round(s.totalProtein || 0)}g`, sub: 'consumed', icon: HiLightBulb, color: 'text-accent' },
          { label: 'Active Nudges', value: nudges.length, sub: 'reminders', icon: HiBell, color: 'text-pink-400' },
        ].map((item, i) => (
          <Card key={i} hover className="!p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.label}</span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-heading font-bold text-white">{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Calorie Progress */}
        <Card className="lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Daily Progress</h3>
          <div className="flex flex-col items-center">
            <NutritionRing value={s.totalCalories || 0} max={goal} label="Calories" color="#10B981" size={120} />
            <div className="mt-4 w-full bg-dark-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-emerald-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">{pct}% of daily goal</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <NutritionRing value={s.totalProtein || 0} max={50} label="Protein" color="#6366F1" size={64} />
            <NutritionRing value={s.totalCarbs || 0} max={250} label="Carbs" color="#F59E0B" size={64} />
            <NutritionRing value={s.totalFat || 0} max={65} label="Fat" color="#EF4444" size={64} />
          </div>
        </Card>

        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Weekly Calorie Trend</h3>
          {weekly.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC' }}
                  labelFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                <Area type="monotone" dataKey="total_calories" stroke="#10B981" strokeWidth={2} fill="url(#calGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-600">
              <p>Log meals to see your weekly trend 📊</p>
            </div>
          )}
        </Card>
      </div>

      {/* Active Nudges & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {nudges.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Active Nudges</h3>
            <div className="space-y-3">
              {nudges.slice(0, 3).map((n, i) => (
                <NudgeCard key={n.id} nudge={n} onComplete={completeNudge} onDelete={() => {}} index={i} />
              ))}
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Smart Suggestions</h3>
            <div className="space-y-3">
              {recs.map((r, i) => (
                <FoodSuggestionCard key={r.id} rec={r} onDismiss={dismissRec} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
