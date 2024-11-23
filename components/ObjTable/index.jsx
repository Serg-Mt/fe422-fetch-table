import { Fragment, useMemo, useState } from 'react';
import classes from './ObjTable.module.css';

function cx(...params) {
  return params
    .filter(s => 'string' === typeof s)
    .join(' ');
}


export function ObjTable({ data, config, addForm, editForm, editedId }) {
  console.debug('ObjTable render', Date.now());
  const
    [sortColumn, setSortColumn] = useState(null),
    [search, setSearch] = useState(''),
    sortedAndFilteredData = useMemo(() => {
      const
        filtered = search
          ? data.filter(row => {
            for (const key in row) {
              // console.log({ key, row }, row[key].includes);
              if (row[key]?.includes?.(search)) return true;
            }
            return false;
          })
          : data,
        sorted = sortColumn
          ? filtered.sort((a, b) => {
            function valueForSort(obj, content, getVal) {
              return
            }
            const
              { content, getVal } = config.columns[Math.abs(sortColumn) - 1],
              cellA = getVal ? getVal(a) : '',
              cellB = getVal ? getVal(b) : '';
            return Math.sign(sortColumn) * cellA.localeCompare(cellB);
          })
          : filtered;
      return sorted;
    }, [data, sortColumn, search]);
  return <>
    <input type="search" value={search} onInput={event => setSearch(event.target.value)} />
    <table className={classes.objtable}>
      <thead onClick={event => {
        const
          td = event.target.closest('td');
        if (!td) return;
        const
          column = td.cellIndex + 1;
        console.log('sortColumn', sortColumn, column);
        setSortColumn(sortColumn === column ? -column : column);

      }}>
        <tr>
          {config.columns.map((c, i) =>
            <td
              key={c.title}
              className={cx(Math.abs(sortColumn) === i + 1 && classes.sorted, Math.abs(sortColumn) === i + 1 && sortColumn < 0 && classes.reverse)}
            >
              {c.title}</td>)}
        </tr>
      </thead>
      <TBody data={sortedAndFilteredData} config={config} editForm={editForm} editedId={editedId} />
      <tfoot>{addForm}</tfoot>
    </table>
    {/* <SimpleTable
      data={sortedAndFilteredData}
      config={config}
      addForm={addForm}
      editForm={editForm}
      editedId={editedId}
    /> */}
  </>;
}

//     function SimpleTable({data, config, addForm, editForm, editedId}) {
//   return <table className={classes.objtable}>
//       <THead config={config} />
//       <TBody data={data} config={config} editForm={editForm} editedId={editedId} />
//       <tfoot>{addForm}</tfoot>
//     </table>
// }

// function THead({ config }) {
//   return <thead>
//     <tr>
//       {config.columns.map(c => <td key={c.title}>{c.title}</td>)}
//     </tr>
//   </thead>;
// }

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