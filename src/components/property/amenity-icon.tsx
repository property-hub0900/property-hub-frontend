import { Circle } from "lucide-react";

type AmenityIconProps = {
  iconName: string;
  className?: string;
  size?: number;
};

export function AmenityIcon({
  iconName,
  className,
  size = 20,
}: AmenityIconProps) {
  try {
    const Icon = require(`lucide-react`)[iconName] || Circle;
    return <Icon size={size} className={className} />;
  } catch {
    return <Circle size={size} className={className} />;
  }
}
