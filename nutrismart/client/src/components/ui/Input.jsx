import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label-text">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-slate-500" />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
