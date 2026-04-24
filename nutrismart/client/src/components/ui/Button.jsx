import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5',
  ghost: 'text-slate-400 hover:text-slate-200 font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:bg-dark-700',
};

export default function Button({ children, variant = 'primary', className = '', loading, icon: Icon, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon className="w-5 h-5" /> : null}
      {children}
    </motion.button>
  );
}
