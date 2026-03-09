import { motion } from "framer-motion";

export const ZenityXLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`font-extrabold tracking-tight ${sizes[size]}`}
    >
      <span className="text-foreground">Zeni</span>
      <span className="text-foreground">ty</span>
      <span className="accent-gradient-text">X</span>
    </motion.div>
  );
};
