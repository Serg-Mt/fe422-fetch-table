import { Fetcher } from '@/components/Fetcher';
import { ObjTable } from '@/components/ObjTable';
import { useState } from 'react';
import { config } from '../configs/jsph';
import { useCallback } from 'react';


const
  random = Math.random()

export function DemoJSPHTable() {
  const
    [users, setUsers] = useState(null),
    onLoad = useCallback(data => setUsers(data), []);
  console.debug('Demo render');

  return <>

    <Fetcher
      url={"https://jsonplaceholder.typicode.com/users?" + random}
      onLoad={onLoad}
    >
      <ObjTable data={users} config={config} />
    </Fetcher>


  </>
}