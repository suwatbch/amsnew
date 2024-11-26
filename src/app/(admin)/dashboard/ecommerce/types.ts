import type { IdType } from '@/types/data'
import type { StaticImageData } from 'next/image'

export type StatType = {
  title: string
  icon: string
  stat: string
  change: number
  subTitle: string
  buttonVariant: string
}

export type IncomeStatType = {
  title: string
  stat: string
}

export type CountrySellingType = {
  flagImage: StaticImageData
  name: string
  progress: number
  amount: number
}

export type RecentOrderType = {
  id: IdType
  name: string
  image: StaticImageData
  amount: number
}
