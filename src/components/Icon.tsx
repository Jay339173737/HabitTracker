import {
  Apple,
  BellOff,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Droplet,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  LayoutGrid,
  Menu,
  Moon,
  Notebook,
  Plus,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Target,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { Text } from "react-native";

const EMOJI_MAP: Record<string, LucideIcon> = {
  "📝": Notebook,
  "⏰": Clock,
  "📱": Smartphone,
  "💼": Briefcase,
  "🗒️": Notebook,
  "🔕": BellOff,
  "🚶": Footprints,
  "🧘": Brain,
  "📓": BookOpen,
  "💧": Droplet,
  "🔥": Flame,
  "📅": Calendar,
  "✓": Check,
  "⊞": LayoutGrid,
  "☰": Menu,
  "🎯": Target,
  "✨": Sparkles,
  "💪": Dumbbell,
  "🍎": Apple,
  "🌙": Moon,
  "☀️": Sun,
  "☕": Coffee,
  "❤️": Heart,
  "⭐": Star,
  "⚡": Zap,
  "＋": Plus,
  "‹": ChevronLeft,
  "›": ChevronRight,
  "👤": User,
};

type Props = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function Icon({
  name,
  size = 22,
  color = "#F5F5F7",
  strokeWidth = 2,
}: Props) {
  const LucideIcon = EMOJI_MAP[name];

  if (LucideIcon) {
    return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} />;
  }

  return (
    <Text style={{ fontSize: size, color, lineHeight: size + 2 }}>{name}</Text>
  );
}
