import Link from 'next/link';
import { title } from 'process';

const pages = [
  { href: '/', title: 'Home' },
  { href: '/jsph-table', title: 'JSPH' },
  { href: '/json-serv-table', title: 'local' },
  { href: '/demo-fetcher', title: 'demo fetcher' }
];


export function Header() {
  return <header>
    <nav>
      <ul>
        {pages.map(({ href, title }) =>
          <li key={href}>
            <Link href={href}>{title}</Link>
          </li>)}
      </ul>
    </nav>
  </header>
}