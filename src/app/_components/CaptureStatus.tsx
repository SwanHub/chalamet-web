"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  step: number;
  onCountdownComplete: () => void;
}

export const CaptureCountdown = ({ step, onCountdownComplete }: Props) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.01) {
          clearInterval(interval);
          onCountdownComplete();
          return 0;
        }
        return +(prev - 0.05).toFixed(2);
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-2 left-2 bg-gray-900/10 text-white px-2 py-1 rounded-full text-sm font-medium">
      {step === 0 && <span>🟢</span>}
      {step === 1 && <span>Screenshot in {countdown.toFixed(2)}</span>}
      {step === 2 && <span>Processing...</span>}
      {step === 3 && (
        <div className="flex items-center gap-1">
          <CheckCircle size={16} className="text-green-400" />
          <span>Complete</span>
        </div>
      )}
    </div>
  );
};
