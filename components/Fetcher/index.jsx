import { useState, useEffect } from 'react';
import { ErrorInfo } from '@/components/Error';
import { Spinner } from '../Spinner';

export function Fetcher({ url, onLoad, children }) {
  const
    [data, setData] = useState(null),
    [error, setError] = useState(null);
  console.debug('Fetcher render data=', data);

  useEffect(() => {
    console.debug('useEffect');
    setData(null);
    setError(null);
    async function go() {
      try {
        const
          response = await fetch(url);
        if (!response.ok) throw new Error(response.status + response.statusText);
        onLoad(await response.json());
        setData(true);
        
      } catch (err) {
        console.log('catch err=',err);
        setError(err);
      }
    };
    go();
  }, [url]);
  if (error)
    return <ErrorInfo error={error} />
  if (data)
    return <>{children}</>
  return <Spinner />;
}