import useSWR from 'swr';
import toast from 'react-hot-toast';
import { ErrorInfo } from '@/components/Error';
import { ObjTable } from '@/components/ObjTable';
import { config } from '@/components/configs/jsph';
import { useState } from 'react';


const
  API_URL = 'http://localhost:3333/users',
  DELETE = 'del',
  ADD = 'add',
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

function AddDataForm({ columns, values, setValues }) {
  // const
  //   [values, setValues] = useState(Array.from({ length: columns.length }, () => ''))
  return <tr>
    {columns.map(({ setVal }, i) => <td key={i}>
      {setVal
        ? <input
          value={values[i]}
          onInput={event => setValues(prev => prev.with(i, event.target.value))} />
        : '-'}
    </td>

    )}
    <td>
      <button data-action={ADD}>🆗</button>
      <button onClick={() => setValues(Array.from({ length: columns.length }, () => ''))}>✖️</button>
    </td>

  </tr>;

}

export function DemoSwr() {
  const
    { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, infoFetcher, { revalidateOnFocus: false }),
    [addFormValues, setAddFormValues] = useState(Array.from({ length: config.columns.length }, () => '')),
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
              return fetch(API_URL + '/' + id, { method: 'DELETE' })
                .then(res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });
            case ADD:
              const
                newObj = config.template;
              config.columns.map(({ setVal }, i) => setVal && Object.assign(newObj, setVal(addFormValues[i])));
              optimisticData = data.concat(newObj);
              return fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(newObj)
              }).then(res => {
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

        await mutate(promise.then(() => optimisticData, () => infoFetcher()), { optimisticData, revalidate: true });
      }
    };

  return <>
    <div style={{ position: 'absolute', fontSize: 'xxx-large' }}>
      {isLoading && '⌛'}
      {isValidating && '👁'}
    </div>
    {error && <ErrorInfo error={error} />}
    <fieldset onClick={onClick}>
      {data &&
        <ObjTable data={data} config={{ columns }} >
          <AddDataForm columns={config.columns} values={addFormValues} setValues={setAddFormValues} />
        </ObjTable>}
    </fieldset>
  </>;
}