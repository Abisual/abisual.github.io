import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
  correctImage?: string;
  showImageWithQuestion?: boolean;
  specialMessage?: {
    answer: string;
    message: string;
  };
}

export const useQuiz = (questions: Question[]) => {
  const [isVerified, setIsVerified] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectImage, setShowCorrectImage] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaShown, setCaptchaShown] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) {
      console.error("Question not found for index:", currentQuestionIndex);
      return;
    }
    
    if (currentQuestion.question === "Кем работает олди?" || answer === currentQuestion.correctAnswer) {
      if (currentQuestion.question === "Кем работает олди?") {
        toast({
          title: "Упс!",
          description: "Тебе знать не положено",
        });
        setShowCorrectImage(true);
        setTimeout(() => {
          setShowCorrectImage(false);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            if (!captchaShown) {
              setShowCaptcha(true);
              setCaptchaShown(true);
            } else {
              setIsVerified(true);
            }
          }
        }, 2000);
      } else if (currentQuestion.correctImage && !currentQuestion.showImageWithQuestion) {
        setShowCorrectImage(true);
        setTimeout(() => {
          setShowCorrectImage(false);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            
            if (!captchaShown && (
              currentQuestionIndex >= Math.floor(questions.length / 2) || 
              Math.random() < 0.2
            )) {
              setShowCaptcha(true);
              setCaptchaShown(true);
            }
          } else {
            if (!captchaShown) {
              setShowCaptcha(true);
              setCaptchaShown(true);
            } else {
              setIsVerified(true);
            }
          }
        }, 2000);
        toast({
          title: "Правильно!",
          description: "Переходим к следующему вопросу",
        });
      } else if (currentQuestionIndex === questions.length - 1) {
        if (!captchaShown) {
          setShowCaptcha(true);
          setCaptchaShown(true);
        } else {
          setIsVerified(true);
          toast({
            title: "Поздравляем!",
            description: "Вы действительно Влад!",
          });
        }
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        toast({
          title: "Правильно!",
          description: "Переходим к следующему вопросу",
        });
      }
    } else {
      if (currentQuestion.specialMessage && answer === currentQuestion.specialMessage.answer) {
        toast({
          variant: "destructive",
          title: "Упс!",
          description: currentQuestion.specialMessage.message,
        });
      }
      setShowWrongAnswer(true);
    }
  };

  const handleRetry = () => {
    setShowWrongAnswer(false);
    setShowQuestion(false);
    setCurrentQuestionIndex(0);
    setCaptchaShown(false);
  };

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    toast({
      title: "Отлично!",
      description: "Вы прошли проверку",
    });
  };

  const handleCaptchaError = () => {
    setShowCaptcha(false);
    setShowWrongAnswer(true);
  };

  return {
    isVerified,
    showQuestion,
    currentQuestionIndex,
    showCorrectImage,
    showWrongAnswer,
    showCaptcha,
    currentQuestion: questions[currentQuestionIndex],
    handleAnswer,
    handleRetry,
    handleCaptchaSuccess,
    handleCaptchaError,
    setShowQuestion,
    setShowCaptcha,
    setShowWrongAnswer
  };
};