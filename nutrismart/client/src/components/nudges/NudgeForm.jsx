import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HiPlus } from 'react-icons/hi';

const nudgeTypes = [
  { value: 'hydration', label: '💧 Hydration' },
  { value: 'meal_reminder', label: '🍽️ Meal Reminder' },
  { value: 'veggie_check', label: '🥦 Veggie Check' },
  { value: 'sugar_limit', label: '🍬 Sugar Limit' },
  { value: 'exercise', label: '🏃 Exercise' },
];

export default function NudgeForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ title: '', message: '', nudge_type: 'hydration', schedule_time: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', message: '', nudge_type: 'hydration', schedule_time: '' });
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-text">Nudge Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {nudgeTypes.map(t => (
            <button key={t.value} type="button" onClick={() => setForm({ ...form, nudge_type: t.value })}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200
                ${form.nudge_type === t.value
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-white/10'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <Input label="Title" placeholder="e.g. Drink Water" value={form.title} onChange={set('title')} required />
      <Input label="Message" placeholder="e.g. Remember to drink 8 glasses today" value={form.message} onChange={set('message')} required />
      <Input label="Schedule Time (optional)" type="time" value={form.schedule_time} onChange={set('schedule_time')} />
      <Button type="submit" loading={loading} icon={HiPlus} variant="accent" className="w-full">
        Create Nudge
      </Button>
    </form>
  );
}
