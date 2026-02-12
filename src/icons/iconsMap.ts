import type { FC, SVGProps } from 'react'

type IconComponent = FC<SVGProps<SVGSVGElement>>

type IconModules = Record<string, IconComponent>

const modules = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  import: 'default',
  query: '?react',
}) as IconModules

const iconsMap = Object.fromEntries(
  Object.entries(modules).map(([path, component]) => {
    const fileName = path.split('/').pop() ?? ''
    const iconName = fileName.replace(/\.svg$/i, '')

    return [iconName, component]
  })
) as Record<string, IconComponent>

export type IconName = keyof typeof iconsMap

export { iconsMap }
