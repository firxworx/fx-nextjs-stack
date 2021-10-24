import clsx from 'clsx'
import { useRouter } from 'next/router'

/**
 * Conditionally render a bullet list of query string key-value pairs if any query parameters are set.
 */
export const QueryStringDisplay: React.FC = () => {
  const router = useRouter()

  const queryStringKeys = Object.keys(router.query ?? {})

  if (!queryStringKeys.length) {
    return null
  }

  return (
    <div className="p-4 rounded-md bg-gray-100 text-gray-600 font-normal text-sm">
      <div className="font-semibold">Query string tester (for AWS Amplify demo):</div>
      <ul className={clsx('list-disc list-inside', queryStringKeys.length ? 'my-2' : '')}>
        {queryStringKeys.map((q) => (
          <li key={q}>
            <span className="font-semibold">
              {q}: {router.query[q]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
