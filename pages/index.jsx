import Head from "next/head";

import { DemoJSPHTable } from '../components/demo/Demo-jsph-table';
import { DemoFetcher } from '../components/demo/Demo-Fetcher';

export default function Home() {
  return <>
    <Head>
      <title>Create Next App</title>
    </Head>
    {/* <DemoFetcher /> */}
    <DemoJSPHTable />
  </>;
}
