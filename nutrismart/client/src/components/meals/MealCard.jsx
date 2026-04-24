import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { HiPencil, HiTrash } from 'react-icons/hi';

const typeColors = { breakfast: 'yellow', lunch: 'green', dinner: 'blue', snack: 'gray' };
const typeEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍿' };

export default function MealCard({ meal, onEdit, onDelete, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass-card-hover p-4 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl shrink-0">
        {typeEmojis[meal.meal_type] || '🍽️'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-slate-100 truncate">{meal.food_name}</h4>
          <Badge color={typeColors[meal.meal_type]}>{meal.meal_type}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{Math.round(meal.calories)} kcal</span>
          <span>P: {meal.protein_g}g</span>
          <span>C: {meal.carbs_g}g</span>
          <span>F: {meal.fat_g}g</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(meal)} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-dark-700 rounded-lg transition-colors">
          <HiPencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(meal.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors">
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
