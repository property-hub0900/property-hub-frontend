import { Circle } from "lucide-react";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";

type AmenityIconProps = {
  iconName: string;
  className?: string;
  size?: number;
};

const DynamicIcon = dynamic(
  async () => {
    const mod = await import("lucide-react");
    return (props: AmenityIconProps) => {
      const IconComponent = mod[
        props.iconName as keyof typeof mod
      ] as LucideIcon;
      return IconComponent ? (
        <IconComponent {...props} />
      ) : (
        <Circle {...props} />
      );
    };
  },
  { ssr: false }
);

export function AmenityIcon(props: AmenityIconProps) {
  return <DynamicIcon {...props} />;
}
