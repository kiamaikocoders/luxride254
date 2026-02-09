import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode, Apple, Play } from "lucide-react";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  packageType: "gold" | "platinum" | "diamond";
}

const DownloadModal: React.FC<DownloadModalProps> = ({ open, onClose, packageType }) => {
  // Deep link URL with package pre-selected
  const deepLinkUrl = `luxeride-vip://subscribe?package=${packageType}`;
  
  // App Store URLs (replace with actual URLs when apps are published)
  const appStoreUrl = "https://apps.apple.com/app/luxeride-vip/id[APP_ID]";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.luxeride.vip";

  const packageNames = {
    gold: "Gold",
    platinum: "Platinum",
    diamond: "Diamond"
  };

  const handleAppStoreClick = () => {
    window.open(appStoreUrl, "_blank");
  };

  const handlePlayStoreClick = () => {
    window.open(playStoreUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Download LuxeRide VIP App
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            To subscribe to the <span className="font-semibold text-yellow-400">{packageNames[packageType]}</span> package, 
            please download our mobile app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-100 p-4 rounded-lg">
              <QrCode className="h-32 w-32 text-gray-800" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Scan with your phone camera to open the app
            </p>
          </div>

          {/* Store Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAppStoreClick}
              className="w-full bg-black text-white hover:bg-gray-800 h-14 flex items-center justify-center space-x-3"
            >
              <Apple className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </Button>

            <Button
              onClick={handlePlayStoreClick}
              className="w-full bg-black text-white hover:bg-gray-800 h-14 flex items-center justify-center space-x-3"
            >
              <Play className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </Button>
          </div>

          {/* Info Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              <Smartphone className="h-4 w-4 inline mr-2" />
              After installing, the app will open with the{" "}
              <span className="font-semibold">{packageNames[packageType]}</span> package pre-selected.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;

