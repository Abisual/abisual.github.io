import { motion } from "framer-motion";

const QuizComplete = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl"
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Вы успешно прошли верификацию!
      </h1>
      <div className="flex flex-col items-center space-y-6">
        <img 
          src="/lovable-uploads/bf93825c-c5d2-44c9-8646-ee8e8b8ec761.png"
          alt="Celebration"
          className="w-full max-w-md rounded-lg shadow-lg mb-6"
        />
        <div className="text-lg text-gray-700 space-y-4 text-center max-w-2xl">
          <p className="mb-4">
            Итак Влад, мы поздравляем тебя с днем рождения. От Андрея, Олди и Марка желаем тебе всего самого наилучшего, а главное, чтобы твои цели достигались, а не просто висели в мечтах.
          </p>
          <p className="mb-4">
            Поэтому от всех нас мы дарим тебе скидку на обучение в любой автошколе в размере 15 000 рублей! Не 2000 рублей на майку с трусами на вайлдберизе, конечно, но тоже сойдет.
          </p>
          <p className="text-gray-600 mt-8">
            По всем вопросам tg: @Abisual
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizComplete;