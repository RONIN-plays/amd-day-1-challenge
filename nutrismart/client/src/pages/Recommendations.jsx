import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import FoodSuggestionCard from '../components/recommendations/FoodSuggestionCard';
import { HiRefresh } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchRecs(); }, []);

  const fetchRecs = async () => {
    try { const { data } = await api.get('/recommendations'); setRecs(data.recommendations || []); }
    catch { toast.error('Failed to load suggestions'); }
    finally { setLoading(false); }
  };

  const dismiss = async (id) => {
    try { await api.post(`/recommendations/${id}/dismiss`); setRecs(recs.filter(r => r.id !== id)); toast.success('Dismissed'); }
    catch { toast.error('Failed'); }
  };

  const regenerate = async () => {
    setRefreshing(true);
    try { const { data } = await api.post('/recommendations/generate'); setRecs(data.recommendations || []); toast.success('Fresh suggestions! 🌿'); }
    catch { toast.error('Failed to refresh'); }
    finally { setRefreshing(false); }
  };

  if (loading) return <div className="page-container flex justify-center pt-20"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-white">Food Suggestions</h1>
          <p className="text-slate-400 text-sm mt-1">Personalized based on your meal history</p>
        </motion.div>
        <Button variant="secondary" icon={HiRefresh} onClick={regenerate} loading={refreshing}>
          Refresh
        </Button>
      </div>

      {recs.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-4xl mb-4">💡</p>
          <h3 className="text-lg font-heading font-semibold text-slate-200 mb-2">No suggestions yet</h3>
          <p className="text-slate-500 mb-6">Log some meals first, then we'll analyze your nutrition and suggest improvements</p>
          <Button icon={HiRefresh} onClick={regenerate}>Generate Suggestions</Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {recs.map((r, i) => (
              <FoodSuggestionCard key={r.id} rec={r} onDismiss={dismiss} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
