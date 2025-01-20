import { useEffect } from "react";
import { motion } from "framer-motion";
import { FakeCaptcha } from "@/components/FakeCaptcha";
import { WrongAnswerDialog } from "@/components/WrongAnswerDialog";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import CorrectAnswer from "@/components/quiz/CorrectAnswer";
import QuizWelcome from "@/components/quiz/QuizWelcome";
import QuizComplete from "@/components/quiz/QuizComplete";
import { useQuiz, Question } from "@/hooks/useQuiz";

const questions: Question[] = [
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
  },
  {
    question: "Что случилось со столом?",
    answers: ["Мышка из руки выпала", "Укусил", "Сам сломался", "Не важно"],
    correctAnswer: "Не важно",
    showImageWithQuestion: true,
    correctImage: "/lovable-uploads/44b702b7-6d27-4172-a14c-2c886d7d3a61.png"
  },
  {
    question: "Кем работает олди?",
    answers: ["МВД", "ФСБ", "ГРУ", "ФСО"],
    correctAnswer: "МВД",
    specialMessage: {
      answer: "МВД",
      message: "Тебе знать не положено"
    }
  },
  {
    question: "Сколько Андрей намайнил на твоей видеокарте?",
    answers: ["Дохуя", "Пидор машину себе купил", "И жене подарки", "Все варианты выше"],
    correctAnswer: "Все варианты выше",
    correctImage: "/lovable-uploads/53e52344-d2a1-4cda-8482-64117b0fa24a.png"
  },
  {
    question: "Если бы вам предложили поработать официантом прямо сейчас, то через сколько дней вы скажете что ебали все в рот и хотите домой?",
    answers: ["90 дней", "7 дней", "30 дней", "5 дней"],
    correctAnswer: "7 дней",
    correctImage: "/lovable-uploads/0ce9f369-9628-46e9-bbe3-568f6b4f188d.png"
  },
  {
    question: "Дальше будет:",
    answers: ["Опять 0", "Иксанет, можно ставить", "Единичка", "Надо еще подождать"],
    correctAnswer: "Иксанет, можно ставить",
    showImageWithQuestion: true,
    correctImage: "/lovable-uploads/7b10d76e-e403-4552-9dd7-59e8e0a1ee77.png"
  },
  {
    question: "Картинка со звуком:",
    answers: ["БЛЯТЬ ОЛДИ", "СУКА", "Я ОПЯТЬ ВСЕ ПРОЕБАЛ", "Все варианты выше"],
    correctAnswer: "Все варианты выше",
    showImageWithQuestion: true,
    correctImage: "/lovable-uploads/83adf1cc-6532-47ad-8039-514ac99b71a9.png"
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

const Quiz = () => {
  const {
    isVerified,
    showQuestion,
    showCorrectImage,
    showWrongAnswer,
    showCaptcha,
    currentQuestion,
    handleAnswer,
    handleRetry,
    handleCaptchaSuccess,
    handleCaptchaError,
    setShowQuestion,
    setShowCaptcha,
    setShowWrongAnswer
  } = useQuiz(questions);

  useEffect(() => {
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
              <QuizWelcome onStart={() => setShowQuestion(true)} />
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
                    <CorrectAnswer 
                      image={currentQuestion.correctImage}
                      isOldiQuestion={currentQuestion.question === "Кем работает олди?"}
                    />
                  </motion.div>
                ) : currentQuestion ? (
                  <QuizQuestion
                    question={currentQuestion.question}
                    answers={currentQuestion.answers}
                    showImageWithQuestion={currentQuestion.showImageWithQuestion}
                    correctImage={currentQuestion.correctImage}
                    onAnswer={handleAnswer}
                  />
                ) : null}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <QuizComplete />
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

export default Quiz;
