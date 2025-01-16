import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-card-foreground"
          >
            Добро пожаловать!
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg"
          >
            <p className="text-muted-foreground">
              Этот сайт посвящен дню рождения известного стримера, киберспортсмена, 
              бодибилдера, темщика, а также музыкального исполнителя. У него есть 
              много ников, но основное его имя - Влад.
            </p>
            <p className="text-muted-foreground">
              Влад известен не только своими достижениями в различных областях, 
              но и тем, что все это жуткий пиздеж и никто вообще середину текста не читает, 
              а просто читает последнее предложение и жмет первую попавшуюся кнопку.
            </p>
            <p className="text-muted-foreground mb-8">
              Для того, чтобы получить подарок к своему дню рождения необходимо 
              пройти верификацию ниже.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center md:justify-start"
            >
              <Button
                asChild
                className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground px-8 py-6 text-lg"
              >
                <Link to="/quiz">Пройти верификацию</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 mix-blend-overlay" />
          <img
            src="/lovable-uploads/bb5cfbad-3323-4c27-9a27-6707aad0afda.png"
            alt="Влад"
            className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;