import { ProjectLayout } from '../components/layout/ProjectLayout'
import { QueryStringDisplay } from '../components/QueryStringDisplay'

export default function WidgetsPage() {
  return (
    <ProjectLayout>
      <h1 className="text-center text-xl text-gray-800">fx-nextjs-stack</h1>
      <h2 className="text-center text-base text-gray-600">nextjs + tailwind starter/boilerplate</h2>
      <h3 className="text-center text-base text-gray-600 font-semibold mt-4">widgets sample page</h3>
      <QueryStringDisplay />
    </ProjectLayout>
  )
}
