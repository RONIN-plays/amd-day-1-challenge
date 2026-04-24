import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiLeafFill } from 'react-icons/ri';
import { HiClipboardList, HiLightBulb, HiBell, HiArrowRight, HiShieldCheck, HiChartBar } from 'react-icons/hi';
import Navbar from '../components/layout/Navbar';

const features = [
  { icon: HiClipboardList, title: 'Smart Meal Logging', desc: 'Track every meal with detailed macro breakdowns. Visualize your daily nutrition with beautiful ring charts.', color: 'from-primary to-emerald-400' },
  { icon: HiLightBulb, title: 'Personalized Suggestions', desc: 'Get food recommendations tailored to your dietary gaps and preferences using our intelligent engine.', color: 'from-secondary to-indigo-400' },
  { icon: HiBell, title: 'Habit Nudges', desc: 'Build lasting habits with gentle reminders for hydration, veggies, sugar limits, and more.', color: 'from-accent to-amber-400' },
  { icon: HiChartBar, title: 'Weekly Analytics', desc: 'Track your progress with comprehensive weekly nutrition stats and calorie trend charts.', color: 'from-pink-500 to-rose-400' },
  { icon: HiShieldCheck, title: 'Diet Aware', desc: 'Supports vegetarian, vegan, keto, paleo and more. All suggestions respect your dietary choices.', color: 'from-cyan-500 to-teal-400' },
  { icon: RiLeafFill, title: 'Global Cuisine', desc: 'Curated food database spanning Indian, Western, Asian and Mediterranean cuisines.', color: 'from-lime-500 to-green-400' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <RiLeafFill className="w-4 h-4" />
              Your Personal Nutrition Companion
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Eat Smarter with{' '}
              <span className="gradient-text">NutriSmart</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Log meals, discover personalized food suggestions, and build lasting healthy habits — all in one beautifully designed app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center gap-2 group">
                Start Your Journey
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
              Everything You Need to Eat Better
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Powerful features designed to make nutrition tracking effortless and enjoyable.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
            <h2 className="text-3xl font-heading font-bold text-white mb-4 relative z-10">Ready to Transform Your Diet?</h2>
            <p className="text-slate-400 mb-8 relative z-10">Join NutriSmart today and take the first step towards a healthier you.</p>
            <Link to="/register" className="btn-primary text-base px-8 py-4 relative z-10 inline-flex items-center gap-2">
              Create Free Account <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiLeafFill className="w-5 h-5 text-primary" />
            <span className="text-sm text-slate-500">NutriSmart © 2026</span>
          </div>
          <p className="text-xs text-slate-600">Built with 💚 for healthier living</p>
        </div>
      </footer>
    </div>
  );
}
