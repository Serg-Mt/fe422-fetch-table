export function MapLink({ geo, text }) {
  return <a href={`https://maps.google.com/?lat=${geo.lat}&lng=${geo.lng}`} >{text}</a>
}
