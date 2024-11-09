import useSWR from 'swr';
import toast from 'react-hot-toast';
import { ErrorInfo } from '@/components/Error';
import { ObjTable } from '@/components/ObjTable';
import { config } from '@/components/configs/jsph';


const
  API_URL = 'http://localhost:3333/users',
  DELETE = 'del',
  fetcher = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('fetch ' + response.status);
    return await response.json();
  },
  infoFetcher = async () => {
    const pr = fetcher();
    toast.promise(pr, {
      loading: 'Fetcher ',
      success: 'ok',
      error: (err) => `${err.toString()}`,
    });
    return await pr;
  },
  columns = config.columns.concat(
    { title: '', content: () => <button data-action={DELETE} >❌</button> }
  )


export function DemoSwr() {
  const
    { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, infoFetcher),
    onClick = async event => {
      const
        action = event.target.closest('[data-action]')?.dataset?.action,
        id = event.target.closest('[data-id]')?.dataset?.id;
      console.log('onClick', { action, id });
      if (!action) return;
      let
        optimisticData;
      const
        getPromise = () => {
          switch (action) {
            case DELETE:
              // if (!id) return;
              optimisticData = data.filter(el => String(el.id) !== id);
              return fetch(API_URL + '/aa' + id, { method: 'DELETE' })
                .then(res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });

          }

        },
        promise = getPromise();

      if (promise) {
        toast.promise(promise, {
          loading: 'Fetching ' + action,
          success: 'ok',
          error: (err) => `${err.toString()}`,
        });

        await mutate(promise.then(() => optimisticData, fetcher), { optimisticData,revalidate:false });
      }
    };

  return <>
    <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
      {isLoading && '⌛'}
      {isValidating && '👁'}
    </div>
    {error && <ErrorInfo error={error} />}
    <fieldset onClick={onClick}>
      {data && <ObjTable data={data} config={{ columns }} />}
    </fieldset>
  </>;
}