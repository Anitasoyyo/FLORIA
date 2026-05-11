export interface StoryCard {
  id: number
  tag: string
  title: string
  content: string
  icon: string
  position: 'left' | 'right'
}

export type SpiceTipo =
  | 'Herbácea'
  | 'Floral'
  | 'Cítrica'
  | 'Aromática'
  | 'Terrosa'
  | 'Leñosa'
  | 'Picante'
  | 'Especiada'
  | 'Dulce'
  | 'Mezcla'

export interface Spice {
  id: number
  nombre: string
  descripcion: string
  tipo: SpiceTipo
  rareza: number   // 1–5
  precio: number   // EUR
  emoji: string
  imagen?: string
  stock: number
  disponible?: number
}
