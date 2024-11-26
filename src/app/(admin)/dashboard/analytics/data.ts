import type { BrowserAndTrafficType, StatType, VisitType } from './types'

import chrome from '@/assets/images/logos/chrome.png'
import inExplorer from '@/assets/images/logos/in-explorer.png'
import microEdge from '@/assets/images/logos/micro-edge.png'
import opera from '@/assets/images/logos/opera.png'

export const statData: StatType[] = [
  {
    title: 'ตึก',
    stat: '24k',
    icon: 'iconoir:hexagon-dice',
    change: '8.5%',
    subTitle: 'New Sessions Today',
    variant: 'success',
  }
]

export const browserAndTrafficData: BrowserAndTrafficType[] = [
  {
    browserLogo: chrome,
    name: 'Chrome',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    bounceRate: 52.8,
    transactions: {
      amount: 566,
      percentage: 92,
    },
  },
  {
    browserLogo: microEdge,
    name: 'Microsoft Edge',
    sessions: {
      amount: 2545,
      percentage: 47,
    },
    bounceRate: 47.54,
    transactions: {
      amount: 498,
      percentage: 81,
    },
  },
  {
    browserLogo: inExplorer,
    name: 'Internet Explorer',
    sessions: {
      amount: 1836,
      percentage: 38,
    },
    bounceRate: 41.12,
    transactions: {
      amount: 455,
      percentage: 74,
    },
  },
  {
    browserLogo: opera,
    name: 'Opera',
    sessions: {
      amount: 1958,
      percentage: 31,
    },
    bounceRate: 36.82,
    transactions: {
      amount: 361,
      percentage: 61,
    },
  },
  {
    browserLogo: chrome,
    name: 'Chrome',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    bounceRate: 52.8,
    transactions: {
      amount: 566,
      percentage: 92,
    },
  },
]

export const visits: VisitType[] = [
  {
    name: 'Organic search',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    change: 52.8,
    period: {
      amount: 566,
      percentage: 92,
    },
    changeVariant: 'success',
  },
  {
    name: 'Direct',
    sessions: {
      amount: 2545,
      percentage: 47,
    },
    change: 17.2,
    period: {
      amount: 498,
      percentage: 81,
    },
    changeVariant: 'danger',
  },
  {
    name: 'Referral',
    sessions: {
      amount: 1836,
      percentage: 38,
    },
    change: 41.12,
    period: {
      amount: 455,
      percentage: 74,
    },
    changeVariant: 'success',
  },
  {
    name: 'Email',
    sessions: {
      amount: 1958,
      percentage: 31,
    },
    change: 8.24,
    period: {
      amount: 361,
      percentage: 61,
    },
    changeVariant: 'danger',
  },
  {
    name: 'Social',
    sessions: {
      amount: 10853,
      percentage: 52,
    },
    change: 29.33,
    period: {
      amount: 566,
      percentage: 92,
    },
    changeVariant: 'success',
  },
]
