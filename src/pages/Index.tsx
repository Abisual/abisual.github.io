import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { FakeCaptcha } from "@/components/FakeCaptcha";
import { WrongAnswerDialog } from "@/components/WrongAnswerDialog";

const questions = [
  {
    question: "Куда надо ставить, чтобы сто процентов зашло?",
    answers: ["На красное", "На черное", "На ноль", "На хуй"],
    correctAnswer: "На красное",
    correctImage: "/lovable-uploads/ab2f1dfe-bc6c-42a8-9be0-50dee7dc0636.png"
  },
  {
    question: "В каком году отменили крепостное право?",
    answers: ["1861", "1761", "1771", "Ебанутый такие вопросы задавать?"],
    correctAnswer: "Ебанутый такие вопросы задавать?",
    correctImage: "/lovable-uploads/7cd25f9b-c69c-4818-87d5-bda89a56e868.png"
  },
  {
    question: "С какой песни началось творчество Vladi$$SLAVE?",
    answers: ["У меня инсульт", "Бросаю курить и не только", "Купили тазик", "Пацаны оценят"],
    correctAnswer: "Купили тазик",
    correctImage: "/lovable-uploads/6c41d02b-9f2e-425b-8221-f63bdb98115d.png"
  },
  {
    question: "Можно ли повторно заряжать электронную сигарету?",
    answers: ["Нет, ни в коем случае", "Можно если использовать диодный мост и понижающий трансформатор", "Можно, если положить на диван и воткнуть в розетку", "Я не курю"],
    correctAnswer: "Можно, если положить на диван и воткнуть в розетку",
    correctImage: "/lovable-uploads/99dda800-612b-4f37-ad11-146ade390a5f.png",
    specialMessage: {
      answer: "Я не курю",
      message: "пиздабол"
    }
  },
  {
    question: "Как нужно распределять доходы, чтобы получалось копить деньги?",
    answers: ["Грамотно подходить к своим тратам", "Стараться избегать импульсивных покупок", "Не донатить в игры, не тратить на то, о чем будешь жалеть", "Лол"],
    correctAnswer: "Лол",
    correctImage: "/lovable-uploads/735d9bcd-5971-4090-aa11-648276e0d25a.png"
  },
  {
    question: "Какого цвета должна быть бмв на проекте гта 5 рп?",
    answers: ["Черная", "Синяя", "Соответствующая цвету банды", "Не люблю бмв"],
    correctAnswer: "Синяя",
    correctImage: "/lovable-uploads/6c41d02b-9f2e-425b-8221-f63bdb98115d.png"
  },
  {
    question: "Что нужно чтобы начать стримить?",
    answers: ["Начать стримить", "Не начать стримить"],
    correctAnswer: "Не начать стримить",
    correctImage: "/lovable-uploads/7b5c8153-cda8-4ca5-ade6-63bd367d3a01.png"
  },
  {
    question: "Сколько стоят читы на пабг?",
    answers: ["Дорого", "Не дорого", "Не играю в пабг", "Не использую читы"],
    correctAnswer: "Не использую читы",
    correctImage: "/lovable-uploads/bbe0681d-4b38-4419-8dd9-81f06eb5b9cf.png"
  }
];

const preloadImages = (imageUrls: string[]) => {
  console.log('Starting image preload for URLs:', imageUrls);
  return Promise.all(imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('Preloaded image:', url);
        resolve(url);
      };
      img.onerror = (err) => {
        console.error('Failed to preload image:', url, err);
        reject(err);
      };
      img.src = url;
    });
  }));
};

const Index = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCorrectImage, setShowCorrectImage] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaShown, setCaptchaShown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Collect all images to preload
    const imagesToPreload = [
      ...questions.map(q => q.correctImage).filter((url): url is string => !!url),
      "/lovable-uploads/810d570e-3b6d-4430-b1c5-fe52be1167ae.png",
      "/lovable-uploads/75fd2ac3-2b28-4702-89d4-67e9601659e4.png",
      "/lovable-uploads/96f11916-23d5-4b61-b884-12e3d8d23b6c.png",
      "/lovable-uploads/aab8729a-237b-4387-8f8d-f9ce7232a2ec.png"
    ];
    
    preloadImages(imagesToPreload).then(() => {
      console.log('All images preloaded successfully');
    }).catch(err => {
      console.error('Error preloading images:', err);
    });
  }, []);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) {
      console.error("Question not found for index:", currentQuestionIndex);
      return;
    }
    
    if (answer === currentQuestion.correctAnswer) {
      if (currentQuestion.correctImage) {
        setShowCorrectImage(true);
        setTimeout(() => {
          setShowCorrectImage(false);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            
            // Show CAPTCHA if it hasn't been shown yet and we're at least halfway through
            // or with a 20% chance after each correct answer
            if (!captchaShown && (
              currentQuestionIndex >= Math.floor(questions.length / 2) || 
              Math.random() < 0.2
            )) {
              setShowCaptcha(true);
              setCaptchaShown(true);
            }
          } else {
            // If we're at the last question and CAPTCHA hasn't been shown yet, show it
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
    setCaptchaShown(false); // Reset captchaShown when retrying
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="w-full max-w-3xl p-8">
        {!isVerified ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl"
          >
            {!showQuestion ? (
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
                  onClick={() => setShowQuestion(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                >
                  Пройти верификацию
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {showCorrectImage && currentQuestion ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center mb-6"
                  >
                    <img 
                      src={currentQuestion.correctImage} 
                      alt="Correct Answer" 
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </motion.div>
                ) : currentQuestion ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      {currentQuestion.question}
                    </h2>
                    <div className="grid gap-4">
                      {currentQuestion.answers.map((answer) => (
                        <Button
                          key={answer}
                          onClick={() => handleAnswer(answer)}
                          variant="outline"
                          className="w-full min-h-[3rem] text-base hover:bg-purple-50 transition-colors whitespace-normal text-left justify-start"
                        >
                          {answer}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              🎉 Поздравляем! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Вы успешно прошли верификацию! Ваш подарок ждет вас!
            </p>
          </motion.div>
        )}
      </div>
      <FakeCaptcha 
        open={showCaptcha} 
        onSuccess={handleCaptchaSuccess}
        onError={handleCaptchaError}
        onClose={() => setShowCaptcha(false)} 
      />
      <WrongAnswerDialog 
        open={showWrongAnswer}
        onClose={() => setShowWrongAnswer(false)}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Index;