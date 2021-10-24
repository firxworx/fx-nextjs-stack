import { ErrorBoundary } from './ErrorBoundary'
import { Header } from './sections/Header'
import { MainSection } from './sections/MainSection'
import { Footer } from './sections/Footer'

/**
 * Project Layout component.
 */
export const ProjectLayout: React.FC = ({ children }) => {
  const innerClassName = 'container mx-auto p-4'

  return (
    <div className="flex min-h-screen w-full flex-col">
      <ErrorBoundary>
        <Header className="bg-blue-50" />
        <MainSection className="py-8 flex-1" innerClassName={innerClassName}>
          {children}
        </MainSection>
        <Footer className="bg-blue-50 shadow" innerClassName={innerClassName} />
      </ErrorBoundary>
    </div>
  )
}
