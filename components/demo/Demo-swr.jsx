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
  EDIT = 'edit',

  START_EDIT = 'start_edit',
  CANCEL_EDIT = 'cancel_edit',
  CLEAR_FORM = 'clear_form',

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
    {
      title: '', content: () => <>
        <button data-action={START_EDIT} >🖊</button>
        <button data-action={DELETE} >❌</button>
      </>
    }
  )

function DataForm({ columns, values, setValues, children }) {
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
      {children}
    </td>

  </tr>;

}

export function DemoSwr() {
  const
    { data, error, isLoading, isValidating, mutate } = useSWR(API_URL, infoFetcher, { revalidateOnFocus: false }),
    [addFormValues, setAddFormValues] = useState(Array.from({ length: config.columns.length }, () => '')),
    [editFormValues, setEditFormValues] = useState(Array.from({ length: config.columns.length }, () => '')),
    [editedId, setEditedId] = useState(null),
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
            case START_EDIT:
              setEditedId(id);
              const
                editedData = data.find(el => String(el.id) === id);
              setEditFormValues(
                config.columns.map(({ setVal, getVal }) =>
                  getVal && setVal
                    ? getVal(editedData)
                    : ''))
              return;
            case CANCEL_EDIT:
              setEditedId(null);
              return;
            case CLEAR_FORM:
              setAddFormValues(
                Array.from({ length: config.columns.length }, () => '')
              )
              return;
            case DELETE:
              // if (!id) return;
              optimisticData = data.filter(el => String(el.id) !== id);
              return fetch(API_URL + '/' + id, { method: 'DELETE' })
                .then(res => {
                  if (!res.ok) {
                    throw (new Error(res.status + ' ' + res.statusText));
                  }
                });
            case ADD: {
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
            case EDIT: {
              const
                index = data.findIndex((obj) => String(obj.id) === String(editedId)),
                clone = structuredClone(data[index]),
                newObj = {};//structuredClone(data.find(el => String(el.id) === id));
              console.log('EDIT', editedId, index, clone, newObj);
              // if (!~index) return;
              config.columns.forEach(({ setVal }, i) => setVal && Object.assign(newObj, setVal(editFormValues[i])));
              config.columns.forEach(({ setVal }, i) => setVal && Object.assign(clone, setVal(editFormValues[i])));
              optimisticData = data.with(index, clone);
              setEditedId(null);
              // return fetch(API_URL + '/' + editedId, {
              //   method: 'PATCH',
              //   headers: {
              //     'Content-Type': 'application/json'
              //   },
              //   body: JSON.stringify(newObj)
              // }).then(res => {
              //   if (!res.ok) {
              //     throw (new Error(res.status + ' ' + res.statusText));
              //   }
              // });
              return fetch(API_URL + '/' + editedId, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(clone)
              }).then(res => {
                if (!res.ok) {
                  throw (new Error(res.status + ' ' + res.statusText));
                }
              });
            }
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
        <ObjTable
          data={data}
          config={{ columns }}
          addForm={
            <DataForm columns={config.columns} values={addFormValues} setValues={setAddFormValues}>
              <button data-action={ADD}>🆕</button>
              <button data-action={CLEAR_FORM}>✖️</button>
            </DataForm>}
          editForm={<DataForm columns={config.columns} values={editFormValues} setValues={setEditFormValues}>
            <button data-action={EDIT}>🆗</button>
            <button data-action={CANCEL_EDIT}>✖️</button>
          </DataForm>}
          editedId={editedId}
        >
        </ObjTable>}
    </fieldset>
  </>;
}