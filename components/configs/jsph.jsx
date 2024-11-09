import { Email } from '../Email';
import { MapLink } from '../MapLink';

export const config = {
  columns: [
    { title: 'id', content: user => user.id },
    { title: 'name', content: ({ name }) => name },
    { title: 'email', content: ({ email }) => <Email email={email} /> },
    { title: 'phone', content: ({ phone }) => phone },
    { title: 'address', content: (({ address }) => <MapLink geo={address.geo} text={`${address.city} ${address.street} ${address.suites}`} />) }
  ]
};
