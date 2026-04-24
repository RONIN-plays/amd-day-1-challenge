const colors = {
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  blue: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
  yellow: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/20',
  gray: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

export default function Badge({ children, color = 'green', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
