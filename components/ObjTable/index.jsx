import { Fragment, useMemo, useState } from 'react';
import classes from './ObjTable.module.css';


export function ObjTable({ data, config, addForm, editForm, editedId }) {
  console.debug('ObjTable render', Date.now());
  const
    [sortColumn, setSortColumn] = useState(null),
    [search, setSearch] = useState(''),
    sorteredAndFilteredData = useMemo(() => {
      return data
        // .sort()
        .filter(row => {
          if (!search.length) return true;
          for (const key in row) {
            // console.log({ key, row }, row[key].includes);
            if (row[key]?.includes?.(search)) return true;
          }
          return false;
        });
    }, [data, sortColumn, search]);
  return <>
    <input type="search" value={search} onInput={event => setSearch(event.target.value)} />
    <SimpleTable
      data={sorteredAndFilteredData}
      config={config}
      addForm={addForm}
      editForm={editForm}
      editedId={editedId}
    />
  </>;
}

function SimpleTable({ data, config, addForm, editForm, editedId }) {
  return <table className={classes.objtable}>
    <THead config={config} />
    <TBody data={data} config={config} editForm={editForm} editedId={editedId} />
    <tfoot>{addForm}</tfoot>
  </table>
}

function THead({ config }) {
  return <thead>
    <tr>
      {config.columns.map(c => <td key={c.title}>{c.title}</td>)}
    </tr>
  </thead>;
}
function TBody({ data, config, editForm, editedId }) {
  return <tbody>
    {data.map(obj =>
      String(obj.id) === editedId
        ? <Fragment key={obj.id}>{editForm}</Fragment>
        : <tr key={obj.id} data-id={obj.id}>
          {
            config.columns.map(({ title, content, getVal }) => {
              // console.log('++', title, content, getVal);
              return <td key={title}>
                {content?.(obj) || getVal?.(obj) || '??'}
              </td>
            })
          }
        </tr>)
    }
  </tbody >;
}