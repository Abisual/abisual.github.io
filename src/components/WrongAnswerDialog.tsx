import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WrongAnswerDialogProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const WrongAnswerDialog = ({ open, onClose, onRetry }: WrongAnswerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <img 
            src="/lovable-uploads/38c1ccb0-b577-4fbe-b586-cca497191b93.png" 
            alt="Wrong Answer" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-xl text-center font-semibold">
            Извините, но вы опять все проебали
          </p>
          <div className="flex justify-center">
            <Button onClick={onRetry}>Начать заново</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};