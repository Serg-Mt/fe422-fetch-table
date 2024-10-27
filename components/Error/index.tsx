export function ErrorInfo({ error }: { error: Error }) {
  return <div style={{ color: 'red' }}>
    {error.toString()}
  </div>
}