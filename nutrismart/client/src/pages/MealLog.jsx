import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import MealCard from '../components/meals/MealCard';
import MealForm from '../components/meals/MealForm';
import { HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MealLog() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMeal, setEditMeal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    try { const { data } = await api.get('/meals'); setMeals(data.meals || []); }
    catch { toast.error('Failed to load meals'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editMeal) {
        await api.put(`/meals/${editMeal.id}`, form);
        toast.success('Meal updated');
      } else {
        await api.post('/meals', form);
        toast.success('Meal logged! 🎉');
      }
      setModalOpen(false); setEditMeal(null); fetchMeals();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (meal) => { setEditMeal(meal); setModalOpen(true); };

  const handleDelete = async (id) => {
    try { await api.delete(`/meals/${id}`); setMeals(meals.filter(m => m.id !== id)); toast.success('Meal deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const grouped = meals.reduce((acc, m) => {
    const date = (m.logged_at || '').split('T')[0] || (m.logged_at || '').split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  if (loading) return <div className="page-container flex justify-center pt-20"><Loader size="lg" /></div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-white">Meal Log</h1>
          <p className="text-slate-400 text-sm mt-1">{meals.length} meals tracked</p>
        </motion.div>
        <Button icon={HiPlus} onClick={() => { setEditMeal(null); setModalOpen(true); }}>
          Log Meal
        </Button>
      </div>

      {meals.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-4xl mb-4">🍽️</p>
          <h3 className="text-lg font-heading font-semibold text-slate-200 mb-2">No meals logged yet</h3>
          <p className="text-slate-500 mb-6">Start tracking your nutrition by logging your first meal</p>
          <Button icon={HiPlus} onClick={() => setModalOpen(true)}>Log Your First Meal</Button>
        </Card>
      ) : (
        Object.entries(grouped).map(([date, dateMeals]) => (
          <div key={date} className="mb-6">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 pl-1">
              {new Date(date).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <div className="space-y-2">
              {dateMeals.map((meal, i) => (
                <MealCard key={meal.id} meal={meal} onEdit={handleEdit} onDelete={handleDelete} index={i} />
              ))}
            </div>
          </div>
        ))
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditMeal(null); }}
        title={editMeal ? 'Edit Meal' : 'Log a Meal'}>
        <MealForm onSubmit={handleSubmit} initialData={editMeal} loading={submitting} />
      </Modal>
    </div>
  );
}
