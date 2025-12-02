import Image, { type ImageProps } from 'next/image'
import { getImage, tw } from '@/utils'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src: string
  alt: string
  className?: string
}

export default async function DynamicImage({
  src,
  alt,
  className,
  ...restProps
}: Props) {
  const { base64, imageProps } = await getImage(src)

  return (
    <div className={tw('relative', className)}>
      <Image
        alt={alt}
        placeholder="blur"
        blurDataURL={base64}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...imageProps}
        {...restProps}
      />
    </div>
  )
}
