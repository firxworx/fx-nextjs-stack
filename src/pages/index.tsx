export default function IndexPage() {
  return (
    <>
      <div className="mb-4 bg-gray-200 h-4"></div>
      <main className="">
        <div className="container mx-auto">
          <h1 className="text-center text-xl text-gray-800">fx-nextjs-stack</h1>
          <h2 className="text-center text-base text-gray-600">nextjs + tailwind starter/boilerplate</h2>
        </div>
      </main>

      <footer className="mt-8 bg-gray-200">
        <div className="container mx-auto text-center p-4">
          <a
            href="https://firxworx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline leading-none"
          >
            https://firxworx.com
          </a>
        </div>
      </footer>
    </>
  )
}
