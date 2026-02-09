import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Apple, Play, Check } from "lucide-react";

interface PackageDetailsModalProps {
  open: boolean;
  onClose: () => void;
  packageType: "gold" | "platinum" | "diamond";
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ open, onClose, packageType }) => {
  // App Store URLs (replace with actual URLs when apps are published)
  const appStoreUrl = "https://apps.apple.com/app/luxeride-vip/id[APP_ID]";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.luxeride.vip";

  const packageDetails = {
    gold: {
      name: "Gold",
      icon: (
        <span className="text-6xl">👑</span>
      ),
      description: "Perfect for busy professionals who value reliability and premium service.",
      summary: "20 rides included • All-inclusive service",
      features: [
        "20 rides included per month",
        "Priority booking",
        "Basic concierge support",
        "Access to luxury fleet",
        "Standard response time",
        "No family members included"
      ]
    },
    platinum: {
      name: "Platinum",
      icon: (
        <span className="text-6xl">⭐</span>
      ),
      description: "Ideal for families who want peace of mind with enhanced services and support.",
      summary: "40 rides included • All-inclusive service",
      features: [
        "40 rides included per month",
        "VIP priority booking",
        "24/7 dedicated concierge",
        "Premium fleet access",
        "Fast response time",
        "Up to 3 family members",
        "Optional security detail"
      ],
      badge: "Most Popular"
    },
    diamond: {
      name: "Diamond",
      icon: (
        <span className="text-6xl">💎</span>
      ),
      description: "Designed for executives who demand excellence with the ultimate luxury experience.",
      summary: "60 rides included • All-inclusive service",
      features: [
        "60 rides included per month",
        "Guaranteed availability",
        "Personal account manager",
        "Exclusive vehicle access",
        "Instant response time",
        "Unlimited family members",
        "Security detail included",
        "Custom route planning"
      ]
    }
  };

  const packageInfo = packageDetails[packageType];

  const handleAppStoreClick = () => {
    window.open(appStoreUrl, "_blank");
  };

  const handlePlayStoreClick = () => {
    window.open(playStoreUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center">
              {packageInfo.icon}
            </div>
          </div>
          <DialogTitle className="text-3xl font-semibold text-center text-gray-900">
            {packageInfo.name} Package
            {packageInfo.badge && (
              <span className="ml-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                {packageInfo.badge}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-gray-600">
            {packageInfo.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div className="text-center">
            <p className="text-gray-700 leading-relaxed">
              {packageInfo.description}
            </p>
          </div>

          {/* Features List */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Features</h3>
            <ul className="space-y-3">
              {packageInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400/10 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 text-center flex items-center justify-center">
                <Smartphone className="h-4 w-4 mr-2" />
                Download our mobile app to subscribe to this package
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsModal;
