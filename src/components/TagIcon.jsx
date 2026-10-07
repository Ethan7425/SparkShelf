import {
  BookOpen, Camera, Coffee, Dumbbell, Flower2, Gift, Heart, House, Laptop, Laugh, Leaf, Lightbulb, Music,
  Palette, PawPrint, Plane, Shirt, ShoppingBag, Sparkles, Tag, UtensilsCrossed, Wallet,
} from 'lucide-react'

export const DEFAULT_TAG_ICON = 'tag'

// Keys are what gets stored, so don't rename them.
export const TAG_ICONS = {
  tag: Tag,
  food: UtensilsCrossed,
  coffee: Coffee,
  fitness: Dumbbell,
  yoga: Flower2,
  heart: Heart,
  home: House,
  travel: Plane,
  style: Shirt,
  shopping: ShoppingBag,
  reading: BookOpen,
  music: Music,
  photo: Camera,
  idea: Lightbulb,
  computer: Laptop,
  beauty: Sparkles,
  nature: Leaf,
  art: Palette,
  pets: PawPrint,
  gift: Gift,
  money: Wallet,
  funny: Laugh,
}

export default function TagIcon({ icon, size = 14 }) {
  const Icon = TAG_ICONS[icon] ?? TAG_ICONS[DEFAULT_TAG_ICON]
  return <Icon size={size} aria-hidden="true" />
}
