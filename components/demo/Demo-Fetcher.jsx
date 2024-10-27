import { useState } from 'react';
import { Fetcher } from '../Fetcher';

import User from '../JSPH/User';

export function DemoFetcher() {
  const
    [id, setId] = useState(1),
    [user, setUser] = useState(null);
  return <>
    <input type="number" value={id} onInput={event => setId(+event.target.value)} />
    <hr />
    <Fetcher
      url={'https://jsonplaceholder.typicode.com/users/' + id}
      onLoad={setUser}>
      <User user={user} />
    </Fetcher>
     {/* {user && <OneUser user={user} />} */}
  </>
}