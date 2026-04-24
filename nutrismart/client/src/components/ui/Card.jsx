import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  const base = hover ? 'glass-card-hover' : 'glass-card';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${base} p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
