import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuizWelcomeProps {
  onStart: () => void;
}

const QuizWelcome = ({ onStart }: QuizWelcomeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-6"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        С Днем Рождения, Влад! 🎉
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Чтобы получить подарок, докажите, что вы Влад
      </p>
      <Button
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
      >
        Пройти верификацию
      </Button>
    </motion.div>
  );
};

export default QuizWelcome;