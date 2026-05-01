import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <AppRoutes /> {/* ✅ THIS WAS MISSING */}
      </motion.div>
    </AnimatePresence>
  );
};

export default App; // ✅ REQUIRED