import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { HiUser, HiSave } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const dietOptions = ['none', 'vegetarian', 'vegan', 'keto', 'paleo'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    weight_kg: user?.weight_kg?.toString() || '',
    height_cm: user?.height_cm?.toString() || '',
    dietary_preference: user?.dietary_preference || 'none',
    health_goal: user?.health_goal || 'balanced diet',
    daily_calorie_goal: user?.daily_calorie_goal?.toString() || '2000',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        age: form.age ? parseInt(form.age) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
        dietary_preference: form.dietary_preference,
        health_goal: form.health_goal,
        daily_calorie_goal: parseInt(form.daily_calorie_goal) || 2000,
      };
      const { data } = await api.put('/auth/profile', payload);
      updateUser(data.user);
      toast.success('Profile updated! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Calculate BMI
  const bmi = form.weight_kg && form.height_cm
    ? (parseFloat(form.weight_kg) / Math.pow(parseFloat(form.height_cm) / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = bmi
    ? bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    : null;

  const bmiColor = bmi
    ? bmi < 18.5 ? 'yellow' : bmi < 25 ? 'green' : bmi < 30 ? 'yellow' : 'red'
    : 'gray';

  return (
    <div className="page-container max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal details and preferences</p>
      </motion.div>

      {/* Avatar & Info Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white font-heading">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge color="green">{form.dietary_preference === 'none' ? 'No preference' : form.dietary_preference}</Badge>
              <Badge color="blue" className="capitalize">{form.health_goal}</Badge>
              {bmi && <Badge color={bmiColor}>BMI: {bmi} ({bmiCategory})</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" placeholder="Your name" icon={HiUser} value={form.name} onChange={set('name')} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" type="number" placeholder="25" value={form.age} onChange={set('age')} />
            <Input label="Daily Calorie Goal" type="number" placeholder="2000" value={form.daily_calorie_goal} onChange={set('daily_calorie_goal')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight (kg)" type="number" step="0.1" placeholder="70" value={form.weight_kg} onChange={set('weight_kg')} />
            <Input label="Height (cm)" type="number" step="0.1" placeholder="170" value={form.height_cm} onChange={set('height_cm')} />
          </div>

          <div>
            <label className="label-text">Dietary Preference</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {dietOptions.map(d => (
                <button key={d} type="button" onClick={() => setForm({ ...form, dietary_preference: d })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium capitalize transition-all duration-200
                    ${form.dietary_preference === d
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-white/10'}`}>
                  {d === 'none' ? 'No Pref' : d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Health Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {['weight loss', 'balanced diet', 'muscle gain'].map(g => (
                <button key={g} type="button" onClick={() => setForm({ ...form, health_goal: g })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium capitalize transition-all duration-200
                    ${form.health_goal === g
                      ? 'bg-secondary/15 text-secondary-light border border-secondary/30'
                      : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-white/10'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} icon={HiSave} className="w-full mt-6">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
