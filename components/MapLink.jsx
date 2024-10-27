export function MapLink({ geo, text }) {
  return <a href={`https://maps.google.com/maps?ll=${geo.lat},${geo.lng}`} >{text}</a>
}
