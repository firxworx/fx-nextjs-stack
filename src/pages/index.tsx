import { ProjectLayout } from '../components/layout/ProjectLayout'
import { QueryStringDisplay } from '../components/QueryStringDisplay'

export default function IndexPage() {
  return (
    <ProjectLayout>
      <h1 className="text-center text-xl text-gray-800">fx-nextjs-stack</h1>
      <h2 className="text-center text-base text-gray-600">nextjs + tailwind starter/boilerplate</h2>
      <h3 className="my-4 text-center text-base text-gray-600 font-semibold">index sample page</h3>
      <QueryStringDisplay />
    </ProjectLayout>
  )
}
