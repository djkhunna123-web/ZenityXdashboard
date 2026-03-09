import { motion } from "framer-motion";

const emojis: Record<number, string> = {
  1: ":(",
  2: ":'(",
  3: "-_-",
  4: ":/",
  5: ":|",
  6: ":)",
  7: "^_^",
  8: ":D",
  9: "<3",
  10: "XD",
};

interface Props {
  value: number;
  onChange: (v: number) => void;
  label: string;
}

export const SatisfactionRating = ({ value, onChange, label }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <motion.span
          key={value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl"
        >
          {emojis[value] || ""}
        </motion.span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <motion.button
            key={n}
            type="button"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(n)}
            className={`
              flex-1 aspect-square rounded-xl border text-sm font-bold transition-all duration-200
              ${value === n
                ? "accent-gradient animate-pulse-glow border-transparent text-accent-foreground shadow-lg shadow-accent/30"
                : value > 0 && n <= value
                  ? "border-accent/30 bg-accent/20 text-accent"
                  : "border-border/50 bg-secondary/50 text-muted-foreground hover:border-accent/30 hover:text-foreground"
              }
            `}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between px-1 text-xs text-muted-foreground">
        <span>น้อยที่สุด</span>
        <span>มากที่สุด</span>
      </div>
    </div>
  );
};
