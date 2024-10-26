import { useState, useEffect } from 'react';
import { Error } from '@/components/Error';
import { ObjTable } from '../ObjTable';
import { Spinner } from '../Spinner';
import { config } from '../configs/jsph';


export function Fetcher({ url }) {
  const
    [data, setData] = useState(null),
    [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    async function go() {
      try {
        const
          response = await fetch(url),
          result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      }
    };
    go();
  }, [url]);

  if (error)
    return <Error error={error} />
  if (data)
    return <ObjTable data={data} config={config} />
  return <Spinner />;
}