import { convertRSSIToRange } from "@/utils/numberHelper";
import Image from "next/image";

type WifiIndicatorProps = {
  rssi: number;
};

const WifiIndicator = ({ rssi }: WifiIndicatorProps) => {
  const signal = convertRSSIToRange(rssi);

  return (
    <div className="pr-1">
      <Image src={`/wifi-${signal}.svg`} alt="wifi" width={23} height={23} />
    </div>
  );
};

export { WifiIndicator };
