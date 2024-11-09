import useSWR from 'swr';
import toast from 'react-hot-toast';
import { ErrorInfo } from '@/components/Error';
import { ObjTable } from '@/components/ObjTable';
import { config } from '@/components/configs/jsph';

const
  API_URL = 'http://localhost:3333/users',
  fetcher = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('fetch ' + response.status);
    return await response.json();
  };


export function DemoSwr() {
  const
    { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, fetcher);

  return <>
    <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
      {isLoading && '⌛'}
      {isValidating && '👁'}
    </div>
    {error && <ErrorInfo error={error} />}
    {data && <ObjTable data={data} config={config}/>}

  </>;
}