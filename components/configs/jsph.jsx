import { Email } from '../Email';
import { MapLink } from '../MapLink';

export const config = {
  template: { address: { geo: {} }, company: {} },
  columns: [
    { title: 'id', content: user => user.id },
    { title: 'name', getVal: ({ name }) => name, setVal: name => ({ name }) },
    { title: 'email', content: ({ email }) => <Email email={email} />, getVal: ({ email }) => email, setVal: email => ({ email }) },
    { title: 'phone', getVal: ({ phone }) => phone },
    { title: 'address', content: (({ address }) => <MapLink geo={address.geo} text={`${address.city} ${address.street} ${address.suites}`} />) },
    { title: 'lat', content: user => +user?.address?.geo?.lat }
  ]
};
