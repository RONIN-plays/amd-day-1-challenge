import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HiPlus, HiCheck } from 'react-icons/hi';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealForm({ onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    meal_type: 'lunch', food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', fiber_g: '', notes: ''
  });

  useEffect(() => {
    if (initialData) setForm({
      meal_type: initialData.meal_type || 'lunch',
      food_name: initialData.food_name || '',
      calories: initialData.calories?.toString() || '',
      protein_g: initialData.protein_g?.toString() || '',
      carbs_g: initialData.carbs_g?.toString() || '',
      fat_g: initialData.fat_g?.toString() || '',
      fiber_g: initialData.fiber_g?.toString() || '',
      notes: initialData.notes || '',
    });
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      calories: parseFloat(form.calories) || 0,
      protein_g: parseFloat(form.protein_g) || 0,
      carbs_g: parseFloat(form.carbs_g) || 0,
      fat_g: parseFloat(form.fat_g) || 0,
      fiber_g: parseFloat(form.fiber_g) || 0,
    });
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-text">Meal Type</label>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map(t => (
            <button key={t} type="button" onClick={() => setForm({ ...form, meal_type: t })}
              className={`py-2 px-3 rounded-xl text-xs font-medium capitalize transition-all duration-200
                ${form.meal_type === t
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-white/10'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <Input label="Food Name" placeholder="e.g. Grilled Chicken Salad" value={form.food_name} onChange={set('food_name')} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Calories (kcal)" type="number" placeholder="0" value={form.calories} onChange={set('calories')} required />
        <Input label="Protein (g)" type="number" placeholder="0" value={form.protein_g} onChange={set('protein_g')} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input label="Carbs (g)" type="number" placeholder="0" value={form.carbs_g} onChange={set('carbs_g')} />
        <Input label="Fat (g)" type="number" placeholder="0" value={form.fat_g} onChange={set('fat_g')} />
        <Input label="Fiber (g)" type="number" placeholder="0" value={form.fiber_g} onChange={set('fiber_g')} />
      </div>
      <Input label="Notes (optional)" placeholder="Any notes..." value={form.notes} onChange={set('notes')} />
      <Button type="submit" loading={loading} icon={initialData ? HiCheck : HiPlus} className="w-full">
        {initialData ? 'Update Meal' : 'Log Meal'}
      </Button>
    </form>
  );
}
