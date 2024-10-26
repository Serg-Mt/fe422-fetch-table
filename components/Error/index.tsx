export function Error({ error }: { error: Error }) {
  return <div style={{ color: 'red' }}>
    {error.toString()}
  </div>
}