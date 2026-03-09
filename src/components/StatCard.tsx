import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
}

export const StatCard = ({ icon: Icon, label, value, sub, delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card-hover p-6"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-3xl font-bold">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </motion.div>
);
