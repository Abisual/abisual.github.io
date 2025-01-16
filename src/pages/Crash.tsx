import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DepositDialog } from "@/components/DepositDialog";

interface Player {
  id: string;
  bet: number;
  multiplier: number | null;
  timestamp: number;
  nickname: string;
}

interface CrashHistory {
  id: string;
  multiplier: number;
  timestamp: number;
}

interface CrashProps {
  nickname: string;
}

const Crash = ({ nickname }: CrashProps) => {
  const [bet, setBet] = useState<string>("");
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  const [playerId] = useState(() => nanoid());
  const [crashHistory, setCrashHistory] = useState<CrashHistory[]>([]);
  const [balance, setBalance] = useState(globalThis.globalBalance);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  const queryClient = useQueryClient();
  const [showDepositDialog, setShowDepositDialog] = useState(false);

  // Add effect to keep local balance in sync with global balance
  useEffect(() => {
    const updateBalance = () => {
      setBalance(globalThis.globalBalance);
    };
    
    // Update initial balance
    updateBalance();
    
    // Set up interval to check for balance changes
    const interval = setInterval(updateBalance, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: () => [],
    initialData: [],
  });

  const generateCrashPoint = () => {
    const r = Math.random();
    const base = Math.exp(-r * 2);
    const crashPoint = Math.floor(100 * (1 / base)) / 100;
    return Math.min(Math.max(1.00, crashPoint), 10.00);
  };

  const updateMultiplier = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const progress = timestamp - startTimeRef.current;
    const newMultiplier = 1 + (progress / 3000);

    if (newMultiplier >= crashPointRef.current) {
      setIsCrashed(true);
      setIsPlaying(false);
      const newHistory: CrashHistory = {
        id: nanoid(),
        multiplier: crashPointRef.current,
        timestamp: Date.now(),
      };
      setCrashHistory(prev => [newHistory, ...prev].slice(0, 5));
      return;
    }

    setMultiplier(Number(newMultiplier.toFixed(2)));
    animationFrameRef.current = requestAnimationFrame(updateMultiplier);
  };

  const startGame = () => {
    if (!bet || isNaN(Number(bet)) || Number(bet) <= 0) {
      alert("Пожалуйста, введите корректную ставку");
      return;
    }

    if (Number(bet) > balance) {
      alert("Недостаточно средств");
      return;
    }

    setIsPlaying(true);
    setIsCrashed(false);
    setCashoutMultiplier(null);
    crashPointRef.current = generateCrashPoint();
    startTimeRef.current = 0;
    console.log("Crash point:", crashPointRef.current);
    
    const newBalance = balance - Number(bet);
    setBalance(newBalance);
    globalThis.globalBalance = newBalance;
    
    const newPlayer: Player = {
      id: playerId,
      bet: Number(bet),
      multiplier: null,
      timestamp: Date.now(),
      nickname,
    };
    
    queryClient.setQueryData<Player[]>(['players'], (old = []) => [...old, newPlayer]);
    animationFrameRef.current = requestAnimationFrame(updateMultiplier);
  };

  const cashout = () => {
    if (isPlaying) {
      const winAmount = Number(bet) * multiplier;
      const newBalance = balance + winAmount;
      setBalance(newBalance);
      globalThis.globalBalance = newBalance;
      
      setCashoutMultiplier(multiplier);
      setIsPlaying(false);
      
      queryClient.setQueryData<Player[]>(['players'], (old = []) => 
        old.map(p => p.id === playerId ? { ...p, multiplier: multiplier } : p)
      );
    }
  };

  useEffect(() => {
    return () => {
      queryClient.setQueryData<Player[]>(['players'], (old = []) => 
        old.filter(p => p.id !== playerId)
      );
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playerId, queryClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fiveSecondsAgo = Date.now() - 5000;
      queryClient.setQueryData<Player[]>(['players'], (old = []) => 
        old.filter(p => p.timestamp > fiveSecondsAgo)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Crash Game</h1>
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold">
              Баланс: {balance.toFixed(2)} ₽
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowDepositDialog(true)}
            >
              Пополнить баланс
            </Button>
          </div>
        </div>

        <div className="mb-8 p-6 bg-black/10 rounded-lg relative min-h-[200px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ 
              backgroundImage: 'url("/lovable-uploads/339ecd52-c91f-4bc6-b863-a9013931aad6.png")',
              filter: 'grayscale(50%)'
            }}
          />
          
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.1] : 1,
              transition: { duration: 0.5, repeat: isPlaying ? Infinity : 0 }
            }}
            className={`text-4xl font-bold relative z-10 ${isCrashed ? 'text-red-500' : cashoutMultiplier ? 'text-green-500' : 'text-primary'}`}
          >
            {isCrashed ? 'CRASH!' : `${multiplier.toFixed(2)}x`}
          </motion.div>
          
          {cashoutMultiplier && !isCrashed && (
            <div className="absolute top-2 right-2 text-green-500 font-bold z-10">
              Выигрыш: {(Number(bet) * cashoutMultiplier).toFixed(2)} ₽
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {crashHistory.map((history) => (
            <div
              key={history.id}
              className={`px-3 py-1 rounded ${
                history.multiplier < 2 ? 'bg-red-500' : 'bg-green-500'
              } text-white font-medium`}
            >
              {history.multiplier.toFixed(2)}x
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Введите ставку"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              disabled={isPlaying}
              className="flex-1"
            />
            {!isPlaying ? (
              <Button 
                onClick={startGame}
                disabled={isCrashed && !bet}
                className="w-32"
              >
                Играть
              </Button>
            ) : (
              <Button 
                onClick={cashout}
                className="w-32 bg-green-500 hover:bg-green-600"
              >
                Забрать
              </Button>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Активные игроки</h2>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg ${
                    player.id === playerId ? 'bg-primary/10' : 'bg-card-secondary'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.nickname}</span>
                      <span className="text-muted-foreground">Ставка: {player.bet} ₽</span>
                    </div>
                    {player.multiplier && (
                      <span className="text-green-500">
                        x{player.multiplier.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DepositDialog 
          open={showDepositDialog} 
          onOpenChange={setShowDepositDialog}
        />
      </div>
    </div>
  );
};

export default Crash;
