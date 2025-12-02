import { Gothic_A1, Noto_Sans_KR } from 'next/font/google'
import localFont from 'next/font/local'

export const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--noto-sans-kr',
})

export const gothicA1 = Gothic_A1({
  subsets: ['latin'],
  variable: '--gothic-a1',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const pretendard = localFont({
  variable: '--pretendard',
  src: './PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
})

export const spoqaHandSansNeo = localFont({
  variable: '--spoqa-han-sans-neo',
  src: [
    {
      path: './SpoqaHanSansNeo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './SpoqaHanSansNeo-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
  ],
})

const fonts = {
  notoSansKR,
  gothicA1,
  pretendard,
  spoqaHandSansNeo,
} as const

export default fonts
