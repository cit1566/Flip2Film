import type { ComponentProps } from 'react'
import { tw } from '@/utils'

type Props = { title: string; showTitle?: boolean } & ComponentProps<'section'>

export default function LearnSection(props: Props) {
  const { title, showTitle = false, children, ...restProps } = props

  return (
    <section {...restProps}>
      <h1 className={tw([showTitle || 'sr-only'])}>{title}</h1>
      {children}
    </section>
  )
}
