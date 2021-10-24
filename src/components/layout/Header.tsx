import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'

// import Image from 'next/image'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const LogoPlaceholder: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-8 p-4 w-auto text-sm uppercase rounded-md bg-blue-200">
      <div className="block lg:hidden">LOGO</div>
      <div className="hidden lg:block">LOGO_FULL</div>
    </div>
  )
}

const AvatarPlaceholder: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <div
      className={clsx(
        'flex justify-center items-center rounded-full bg-green-200 text-sm uppercase',
        isMobile ? 'h-10 w-10' : 'h-8 w-8',
      )}
    >
      X
    </div>
  )
}

interface NavLinkProps {
  path: string
  name: string
  isCurrent?: boolean
}

const NavLink: React.FC<NavLinkProps & { variant: 'desktop' | 'mobile' }> = ({
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
        ' hover:border-gray-300 hover:text-gray-700',
        isCurrent ? 'border-indigo-500' : 'border-transparent text-gray-500',
        {
          ['inline-flex items-center px-1 pt-1 border-b-2']: variant === 'desktop',
          ['text-gray-900']: variant === 'desktop' && isCurrent,
          ['block hover:bg-gray-50 pl-3 pr-4 py-2 border-l-4']: variant === 'mobile',
          ['bg-indigo-50 text-indigo-700']: variant === 'mobile' && isCurrent,
        },
      )}
    >
      {name}
    </a>
  )
}

const MenuLink: React.FC<{}> = ({}) => {
  return <></>
}

// prefix `path` values with a leading slash
const links: Array<NavLinkProps> = [
  {
    path: '/',
    name: 'Dashboard',
  },
  {
    path: '/projects',
    name: 'Projects',
  },
  {
    path: '/widgets',
    name: 'Widgets',
  },
]

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <LogoPlaceholder />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {links.map((link) => (
                    <NavLink
                      key={link.path}
                      path={link.path}
                      name={link.name}
                      variant="desktop"
                      isCurrent={link.path === router.pathname}
                    />
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <AvatarPlaceholder isMobile={false} />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  path={link.path}
                  name={link.name}
                  variant="mobile"
                  isCurrent={link.name === 'Dashboard'}
                />
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <AvatarPlaceholder isMobile />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Bob Smith</div>
                  <div className="text-sm font-medium text-gray-500">bob@example.com</div>
                </div>
                <button className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
