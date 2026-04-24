import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { HiCheck, HiTrash, HiBell, HiClock } from 'react-icons/hi';

const typeEmojis = { hydration: '💧', meal_reminder: '🍽️', veggie_check: '🥦', sugar_limit: '🍬', exercise: '🏃' };
const typeColors = { hydration: 'blue', meal_reminder: 'green', veggie_check: 'green', sugar_limit: 'yellow', exercise: 'red' };

export default function NudgeCard({ nudge, onComplete, onDelete, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`glass-card-hover p-4 flex items-center gap-4 ${nudge.is_completed ? 'opacity-60' : ''}`}
    >
      <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl shrink-0">
        {typeEmojis[nudge.nudge_type] || '🔔'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className={`text-sm font-semibold truncate ${nudge.is_completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
            {nudge.title}
          </h4>
          <Badge color={typeColors[nudge.nudge_type] || 'gray'}>{nudge.nudge_type?.replace('_', ' ')}</Badge>
        </div>
        <p className="text-xs text-slate-500 truncate">{nudge.message}</p>
        {nudge.schedule_time && (
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
            <HiClock className="w-3 h-3" />
            {nudge.schedule_time}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!nudge.is_completed && (
          <button onClick={() => onComplete(nudge.id)}
            className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <HiCheck className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onDelete(nudge.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors">
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
