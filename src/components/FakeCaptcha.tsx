import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface FakeCaptchaProps {
  onSuccess: () => void;
  onClose: () => void;
  onError: () => void;
  open: boolean;
}

const originalImages = [
  "/lovable-uploads/810d570e-3b6d-4430-b1c5-fe52be1167ae.png",
  "/lovable-uploads/75fd2ac3-2b28-4702-89d4-67e9601659e4.png",
  "/lovable-uploads/96f11916-23d5-4b61-b884-12e3d8d23b6c.png",
  "/lovable-uploads/aab8729a-237b-4387-8f8d-f9ce7232a2ec.png"
];

export const FakeCaptcha = ({ onSuccess, onClose, onError, open }: FakeCaptchaProps) => {
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  // Reset selections and randomize images when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedImages(new Set());
      // Shuffle images
      const shuffled = [...originalImages]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      setImages(shuffled);
      console.log("Captcha opened, images shuffled and selections reset");
    }
  }, [open]);

  const toggleImage = (index: number) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  const handleVerify = () => {
    // Get indices of the original first and last images in the shuffled array
    const firstImageIndex = images.indexOf(originalImages[0]);
    const lastImageIndex = images.indexOf(originalImages[3]);

    // Check if selected images are correct (first and last from original order)
    if (selectedImages.has(firstImageIndex) && selectedImages.has(lastImageIndex) && selectedImages.size === 2) {
      console.log("Captcha verified successfully");
      onSuccess();
    } else {
      console.log("Captcha verification failed");
      toast({
        variant: "destructive",
        title: "Извините, но вы опять все проебали",
      });
      onError();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Подтвердите, что вы человек</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Выберите все изображения, где Влад думает
          </p>
          <div className="grid grid-cols-2 gap-2">
            {images.map((src, index) => (
              <div
                key={index}
                className={`relative cursor-pointer border-2 rounded-md overflow-hidden ${
                  selectedImages.has(index) ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => toggleImage(index)}
              >
                <img src={src} alt={`Image ${index + 1}`} className="w-full h-40 object-cover" />
                {selectedImages.has(index) && (
                  <div className="absolute inset-0 bg-blue-500/20" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleVerify}>Подтвердить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};