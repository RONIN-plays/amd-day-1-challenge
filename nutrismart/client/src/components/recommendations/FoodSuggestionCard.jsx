import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { HiX, HiLightBulb } from 'react-icons/hi';

const catColors = { 'high-protein': 'blue', 'fiber-rich': 'green', 'low-carb': 'yellow', balanced: 'gray', 'vitamin-boost': 'red' };

export default function FoodSuggestionCard({ rec, onDismiss, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="glass-card-hover p-5 relative group"
    >
      <button onClick={() => onDismiss(rec.id)}
        className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-slate-300 hover:bg-dark-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
        <HiX className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 flex items-center justify-center shrink-0">
          <HiLightBulb className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-100 text-sm">{rec.food_name}</h4>
          <Badge color={catColors[rec.category] || 'gray'} className="mt-1">{rec.category?.replace('-', ' ')}</Badge>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-3">{rec.reason}</p>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        {rec.calories && <span>{Math.round(rec.calories)} kcal</span>}
        {rec.protein_g && <span>P: {rec.protein_g}g</span>}
        {rec.carbs_g && <span>C: {rec.carbs_g}g</span>}
        {rec.fat_g && <span>F: {rec.fat_g}g</span>}
      </div>
    </motion.div>
  );
}
