import type { SVGProps } from 'react'
import { forwardRef } from 'react'

import { iconsMap } from './iconsMap'
import type { IconName } from './iconsMap'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type IconProps = {
  name: IconName
  size?: IconSize
  className?: string
} & SVGProps<SVGSVGElement>

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, ...rest }, ref) => {
    const SvgIcon = iconsMap[name]

    if (!SvgIcon) {
      return null
    }

    const classes = ['icon', `icon--${size}`, className]
      .filter(Boolean)
      .join(' ')

    return <SvgIcon ref={ref} className={classes} {...rest} />
  }
)

Icon.displayName = 'Icon'
