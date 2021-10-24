import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { QueryStringList } from '../components/QueryStringList'

export default function IndexPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center text-xl text-gray-800">fx-nextjs-stack</h1>
          <h2 className="text-center text-base text-gray-600">nextjs + tailwind starter/boilerplate</h2>
          <h3 className="text-center text-base text-gray-600 font-semibold mt-4">index sample page</h3>
          <div className="mt-8 bg-gray-100 text-gray-600 font-normal text-sm">
            <div className="mb-2 font-semibold">Query string tester (for aws):</div>
            <QueryStringList />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
