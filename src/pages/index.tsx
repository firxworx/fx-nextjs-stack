import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export default function IndexPage() {
  return (
    <>
      <Header />
      <main className="py-8">
        <div className="container mx-auto">
          <h1 className="text-center text-xl text-gray-800">fx-nextjs-stack</h1>
          <h2 className="text-center text-base text-gray-600">nextjs + tailwind starter/boilerplate</h2>
        </div>
      </main>
      <Footer />
    </>
  )
}
