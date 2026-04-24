import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHome, HiClipboardList, HiLightBulb, HiBell, HiUser } from 'react-icons/hi';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/meals', label: 'Meal Log', icon: HiClipboardList },
  { to: '/recommendations', label: 'Suggestions', icon: HiLightBulb },
  { to: '/nudges', label: 'Nudges', icon: HiBell },
  { to: '/profile', label: 'Profile', icon: HiUser },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 z-30 w-64 bg-dark-900/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full py-6 px-4">
          <div className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="glass-card p-4">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Daily Tip</p>
              <p className="text-sm text-slate-300">Drink a glass of water before each meal to aid digestion 💧</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
