import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: string;
  answers: string[];
  showImageWithQuestion?: boolean;
  correctImage?: string;
  onAnswer: (answer: string) => void;
}

const QuizQuestion = ({ 
  question, 
  answers, 
  showImageWithQuestion, 
  correctImage, 
  onAnswer 
}: QuizQuestionProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {question}
      </h2>
      {showImageWithQuestion && correctImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-6"
        >
          <img 
            src={correctImage} 
            alt="Question Image" 
            className="max-w-full h-auto rounded-lg shadow-lg max-h-[400px] object-contain"
          />
        </motion.div>
      )}
      <div className="grid gap-4">
        {answers.map((answer) => (
          <Button
            key={answer}
            onClick={() => onAnswer(answer)}
            variant="outline"
            className="w-full min-h-[3rem] text-base hover:bg-purple-50 transition-colors whitespace-normal text-left justify-start"
          >
            {answer}
          </Button>
        ))}
      </div>
    </>
  );
};

export default QuizQuestion;