export const MainSection: React.FC<{ className: string; innerClassName: string }> = ({
  className,
  innerClassName,
  children,
}) => {
  return (
    <main className={className}>
      <section className={innerClassName}>{children}</section>
    </main>
  )
}
