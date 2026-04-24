import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import NudgeCard from '../components/nudges/NudgeCard';
import NudgeForm from '../components/nudges/NudgeForm';
import { HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Nudges() {
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchNudges(); }, []);

  const fetchNudges = async () => {
    try { const { data } = await api.get('/nudges'); setNudges(data.nudges || []); }
    catch { toast.error('Failed to load nudges'); }
    finally { setLoading(false); }
  };

  const createNudge = async (form) => {
    setSubmitting(true);
    try { await api.post('/nudges', form); toast.success('Nudge created! 🔔'); setModalOpen(false); fetchNudges(); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const completeNudge = async (id) => {
    try { await api.post(`/nudges/${id}/complete`); fetchNudges(); toast.success('Well done! ✅'); }
    catch { toast.error('Failed'); }
  };

  const deleteNudge = async (id) => {
    try { await api.delete(`/nudges/${id}`); setNudges(nudges.filter(n => n.id !== id)); toast.success('Nudge removed'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="page-container flex justify-center pt-20"><Loader size="lg" /></div>;

  const active = nudges.filter(n => !n.is_completed);
  const completed = nudges.filter(n => n.is_completed);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-white">Habit Nudges</h1>
          <p className="text-slate-400 text-sm mt-1">Build healthier habits with gentle reminders</p>
        </motion.div>
        <Button icon={HiPlus} variant="accent" onClick={() => setModalOpen(true)}>New Nudge</Button>
      </div>

      {nudges.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-4xl mb-4">🔔</p>
          <h3 className="text-lg font-heading font-semibold text-slate-200 mb-2">No nudges yet</h3>
          <p className="text-slate-500 mb-6">Create habit reminders to stay on track with your health goals</p>
          <Button icon={HiPlus} variant="accent" onClick={() => setModalOpen(true)}>Create Your First Nudge</Button>
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Active ({active.length})</h3>
              <div className="space-y-2">
                {active.map((n, i) => <NudgeCard key={n.id} nudge={n} onComplete={completeNudge} onDelete={deleteNudge} index={i} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Completed ({completed.length})</h3>
              <div className="space-y-2">
                {completed.map((n, i) => <NudgeCard key={n.id} nudge={n} onComplete={completeNudge} onDelete={deleteNudge} index={i} />)}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create a Nudge">
        <NudgeForm onSubmit={createNudge} loading={submitting} />
      </Modal>
    </div>
  );
}
