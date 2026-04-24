import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { RiLeafFill } from 'react-icons/ri';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', health_goal: 'balanced diet' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.health_goal);
      toast.success('Account created! Welcome to NutriSmart 🌱');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-primary/8 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
              <RiLeafFill className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold gradient-text">NutriSmart</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Start your healthier eating journey</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" placeholder="Your name" icon={HiUser}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" placeholder="you@example.com" icon={HiMail}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="Min 6 characters" icon={HiLockClosed}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Input label="Confirm Password" type="password" placeholder="••••••••" icon={HiLockClosed}
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
            
            <div>
              <label className="label-text">Primary Health Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {['weight loss', 'balanced diet', 'muscle gain'].map(g => (
                  <button key={g} type="button" onClick={() => setForm({ ...form, health_goal: g })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize transition-all duration-200
                      ${form.health_goal === g
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-white/10'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
