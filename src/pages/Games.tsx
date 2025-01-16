import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Roulette from "./Roulette";
import Crash from "./Crash";

// Создаем глобальную переменную для хранения баланса
declare global {
  var globalBalance: number;
}
globalThis.globalBalance = globalThis.globalBalance || 1000;

const Games = () => {
  const [nickname, setNickname] = useState("");
  const [showNicknameDialog, setShowNicknameDialog] = useState(true);
  const [balance, setBalance] = useState(globalThis.globalBalance);
  const navigate = useNavigate();

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

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setShowNicknameDialog(false);
      navigate("roulette"); // По умолчанию открываем рулетку
    }
  };

  if (showNicknameDialog) {
    return (
      <Dialog open={showNicknameDialog} onOpenChange={setShowNicknameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Введите ваш никнейм</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button onClick={handleNicknameSubmit} disabled={!nickname.trim()}>
              Начать игру
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("roulette")}
          >
            Рулетка
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("crash")}
          >
            Краш
          </Button>
        </div>
        <div className="text-xl font-semibold">
          Баланс: {balance.toFixed(2)} ₽
        </div>
      </div>

      <Routes>
        <Route path="roulette" element={<Roulette nickname={nickname} />} />
        <Route path="crash" element={<Crash nickname={nickname} />} />
      </Routes>
    </div>
  );
};

export default Games;
