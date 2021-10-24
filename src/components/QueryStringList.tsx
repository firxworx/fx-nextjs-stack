import { useRouter } from 'next/router'

export const QueryStringList: React.FC = () => {
  const router = useRouter()

  return (
    <ul className="list-disc list-inside">
      {Object.keys(router.query ?? {}).map((q) => (
        <li key={q}>
          <span className="font-semibold">
            {q}: {router.query[q]}
          </span>
        </li>
      ))}
    </ul>
  )
}
