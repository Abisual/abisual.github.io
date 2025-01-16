import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Player = {
  id: string;
  nickname: string;
  balance: number;
  bet: number;
  betType: string;
};

const INITIAL_BALANCE = 1000;
const SPIN_DURATION = 15000;
const SPIN_INTERVAL = 20000;

const multipliers = [
  { value: 2, weight: 50, color: "bg-white" },
  { value: 3, weight: 30, color: "bg-red-500" },
  { value: 5, weight: 15, color: "bg-green-500" },
  { value: 10, weight: 5, color: "bg-orange-500" }
];

const Roulette = () => {
  const [nickname, setNickname] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentBet, setCurrentBet] = useState("");
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [nextSpinTime, setNextSpinTime] = useState(SPIN_INTERVAL);
  const [history, setHistory] = useState<Array<{ value: number; color: string }>>([]);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const startGame = () => {
    if (!nickname.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите никнейм",
        variant: "destructive",
      });
      return;
    }

    const newPlayer = {
      id: Math.random().toString(36).substr(2, 9),
      nickname,
      balance: INITIAL_BALANCE,
      bet: 0,
      betType: "",
    };

    setPlayers(prev => [...prev, newPlayer]);
    setIsPlaying(true);
  };

  const placeBet = (multiplier: number) => {
    const betAmount = Number(currentBet);
    if (!betAmount) {
      toast({
        title: "Ошибка",
        description: "Укажите сумму ставки",
        variant: "destructive",
      });
      return;
    }

    const player = players.find(p => p.nickname === nickname);
    if (!player) return;

    if (betAmount > player.balance) {
      toast({
        title: "Ошибка",
        description: "Недостаточно средств",
        variant: "destructive",
      });
      return;
    }

    setPlayers(prev =>
      prev.map(p =>
        p.nickname === nickname
          ? { ...p, bet: betAmount, betType: `x${multiplier}` }
          : p
      )
    );
    setSelectedMultiplier(multiplier);
  };

  const createSpinnerItems = () => {
    const items = [];
    const totalItems = 100; // Total number of items in the spinner
    
    multipliers.forEach(multiplier => {
      const itemCount = Math.round(totalItems * (multiplier.weight / 100));
      for (let i = 0; i < itemCount; i++) {
        items.push(multiplier);
      }
    });
    
    return items.sort(() => Math.random() - 0.5);
  };

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setNextSpinTime(SPIN_INTERVAL);
    
    const totalWeight = multipliers.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    let resultMultiplier = multipliers[0];
    
    for (const multiplier of multipliers) {
      if (random <= multiplier.weight) {
        resultMultiplier = multiplier;
        break;
      }
      random -= multiplier.weight;
    }

    if (spinnerRef.current) {
      const distance = -2000;
      
      animate(spinnerRef.current, 
        { 
          x: [0, distance]
        }, 
        { 
          duration: 5,
          ease: [0.25, 0.1, 0.25, 1],
        }
      ).then(() => {
        if (spinnerRef.current) {
          spinnerRef.current.style.transform = 'translateX(0px)';
        }
      });
    }

    setTimeout(() => {
      setResult(resultMultiplier.value);
      setHistory(prev => {
        const newHistory = [{ value: resultMultiplier.value, color: resultMultiplier.color }, ...prev];
        return newHistory.slice(0, 10);
      });
      
      setPlayers(prev =>
        prev.map(p => {
          if (p.bet && p.betType === `x${resultMultiplier.value}`) {
            return {
              ...p,
              balance: p.balance + (p.bet * resultMultiplier.value),
              bet: 0,
              betType: "",
            };
          }
          return p.bet ? { ...p, balance: p.balance - p.bet, bet: 0, betType: "" } : p;
        })
      );
      
      setSpinning(false);
      setSelectedMultiplier(null);
      setCurrentBet("");
    }, 5000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdown: NodeJS.Timeout;
    
    if (isPlaying && !spinning) {
      interval = setInterval(spinWheel, SPIN_INTERVAL);
      countdown = setInterval(() => {
        setNextSpinTime(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (countdown) clearInterval(countdown);
    };
  }, [isPlaying, spinning]);

  const spinnerItems = useRef(createSpinnerItems()).current;

  if (!isPlaying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/95">
        <div className="bg-gray-800/50 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Добро пожаловать в рулетку
          </h2>
          <div className="space-y-4">
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите ваш никнейм"
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Начать игру
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-black/95 rounded-xl p-8 shadow-2xl text-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Лучше здесь и бесплатно, чем где-то еще</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {history.map((item, index) => (
              <div
                key={index}
                className={`${item.color} w-8 h-8 rounded flex items-center justify-center text-black font-bold`}
              >
                {item.value}x
              </div>
            ))}
          </div>
          <div className="text-xl font-bold">
            Следующий спин через: {Math.floor(nextSpinTime / 1000)}с
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="relative w-full h-24 mb-8 overflow-hidden bg-gray-900 rounded-lg">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 z-10" />
            
            <div className="absolute inset-0 flex items-center">
              <motion.div
                ref={spinnerRef}
                className="flex"
                initial={{ x: 0 }}
              >
                {spinnerItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-24 h-24 ${item.color} border border-gray-800 flex items-center justify-center text-black font-bold text-xl`}
                  >
                    x{item.value}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {multipliers.map((m) => (
              <Button
                key={m.value}
                onClick={() => placeBet(m.value)}
                disabled={spinning || selectedMultiplier !== null}
                className={`${
                  selectedMultiplier === m.value 
                    ? "ring-2 ring-white" 
                    : ""
                } ${m.color} text-black font-bold`}
              >
                x{m.value}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-4">
            <Input
              type="number"
              value={currentBet}
              onChange={(e) => setCurrentBet(e.target.value)}
              placeholder="Сумма ставки"
              min={0}
              className="bg-gray-800 border-gray-700 text-white [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Игроки</h3>
          <div className="space-y-4">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-gray-800/50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{player.nickname}</span>
                  <span className="text-green-400">{player.balance} ₽</span>
                </div>
                {player.bet > 0 && (
                  <div className="text-sm text-gray-400 mt-2">
                    Ставка: {player.bet} ₽ на {player.betType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-8 text-center italic">
        Да, числа не совпадают с тем что выпало на анимации. Нет времени исправлять, че ты мне сделаешь вообще? Пошёл нахуй.
      </p>
    </div>
  );
};

export default Roulette;
