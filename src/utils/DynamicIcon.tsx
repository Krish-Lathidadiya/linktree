import { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa"; // FontAwesome icons
import * as MdIcons from "react-icons/md"; // Material icons
import * as AiIcons from "react-icons/ai"; // AntDesign icons

interface DynamicIconProps {
  iconName: string;
  library: "fa" | "md" | "ai";
  className?: string;
}

const iconLibraries: Record<string, Record<string, IconType>> = {
  fa: FaIcons,
  md: MdIcons,
  ai: AiIcons,
};

const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  library,
  className,
}) => {
  const IconComponent = iconLibraries[library]?.[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in library "${library}"`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;
