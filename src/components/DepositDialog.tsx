import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { id: "visa", name: "Visa" },
  { id: "mir", name: "МИР" },
  { id: "btc", name: "Bitcoin (BTC)" },
  { id: "eth", name: "Ethereum (ETH)" },
  { id: "sakura", name: "Sakura" },
];

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const { toast } = useToast();

  const handleDeposit = () => {
    const depositAmount = Number(amount);
    if (!method) {
      toast({
        title: "Ошибка",
        description: "Выберите метод оплаты",
        variant: "destructive",
      });
      return;
    }
    if (!depositAmount || depositAmount <= 0 || depositAmount > 10000) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму (не более 10000 ₽)",
        variant: "destructive",
      });
      return;
    }

    globalThis.globalBalance += depositAmount;
    toast({
      title: "Успешно",
      description: `Баланс пополнен на ${depositAmount} ₽`,
    });
    onOpenChange(false);
    setAmount("");
    setMethod("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Пополнение баланса</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Сумма пополнения</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму (макс. 10000 ₽)"
                  max={10000}
                />
              </div>
              <div className="grid gap-2">
                <Label>Способ оплаты</Label>
                <RadioGroup value={method} onValueChange={setMethod}>
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={pm.id} id={pm.id} />
                      <Label htmlFor={pm.id}>{pm.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleDeposit}>Пополнить</Button>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="/lovable-uploads/e6dd465e-6e7b-4ad1-8b53-1f33a92fed19.png" 
              alt="Deposit illustration" 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}