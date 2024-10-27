import { useState } from 'react';
import classes from './ObjTable.module.css';
import { useMemo } from 'react';


export function ObjTable({ data, config }) {
  console.debug('ObjTable render');
  const
    [sortColumn, setSortColumn] = useState(null),
    [search, setSearch] = useState(''),
    sorteredAndFilteredData = useMemo(() => {
      return data
        // .sort()
        .filter(row => {
          if (!search.length) return true;
          for (const key in row) {
            console.log({ key, row }, row[key].includes);
            if (row[key]?.includes?.(search)) return true;
          }
          return false;
        });
    }, [data, sortColumn, search]);
  return <>
    <input type="search" value={search} onInput={event => setSearch(event.target.value)} />
    <SimpleTable data={sorteredAndFilteredData} config={config} />
  </>;
}

function SimpleTable({ data, config }) {
  return <table className={classes.objtable}>
    <THead config={config} />
    <TBody data={data} config={config} />
  </table>
}

function THead({ config }) {
  return <thead>
    <tr>
      {config.columns.map(c => <td key={c.title}>{c.title}</td>)}
    </tr>
  </thead>;
}
function TBody({ data, config }) {
  return <tbody>
    {data.map(obj => <tr key={obj.id}>
      {config.columns.map(({ title, content }) => <td key={title}>
        {content(obj)}
      </td>)}
    </tr>)}
  </tbody>;
}