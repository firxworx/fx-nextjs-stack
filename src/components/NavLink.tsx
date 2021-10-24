import clsx from 'clsx'

/**
 * NavLink component props.
 * Values for `path` should generally be prefixed by a `/`.
 */
export interface NavLinkProps {
  path: string
  name: string
  isCurrent?: boolean
}

export const NavLink: React.FC<NavLinkProps & { variant: 'desktop' | 'mobile' }> = ({
  path,
  name,
  variant,
  isCurrent = false,
}) => {
  return (
    <a
      href={path}
      className={clsx(
        'font-medium text-base',
        isCurrent ? 'border-blue-500 hover:border-blue-500' : 'border-transparent text-gray-500',
        {
          ['inline-flex items-center px-1 pt-1 border-b-2']: variant === 'desktop',
          ['hover:border-blue-200']: variant === 'desktop' && !isCurrent,
          ['text-blue-700']: variant === 'desktop' && isCurrent,
          ['block pl-3 pr-4 py-2 border-l-4']: variant === 'mobile',
          ['hover:border-blue-200 hover:text-blue-500 hover:bg-blue-100']: variant === 'mobile' && !isCurrent,
          ['bg-blue-100 text-blue-700 hover:text-blue-700']: variant === 'mobile' && isCurrent,
        },
      )}
    >
      {name}
    </a>
  )
}
