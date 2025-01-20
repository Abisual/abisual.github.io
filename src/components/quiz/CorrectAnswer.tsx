import { motion } from "framer-motion";

interface CorrectAnswerProps {
  image?: string;
  isOldiQuestion?: boolean;
}

const CorrectAnswer = ({ image, isOldiQuestion }: CorrectAnswerProps) => {
  if (isOldiQuestion) {
    return (
      <div className="text-2xl font-bold text-gray-800 p-8 bg-white rounded-lg shadow-lg">
        Тебе знать не положено
      </div>
    );
  }

  if (!image) return null;

  return (
    <img 
      src={image} 
      alt="Correct Answer" 
      className="max-w-full h-auto rounded-lg shadow-lg"
    />
  );
};

export default CorrectAnswer;