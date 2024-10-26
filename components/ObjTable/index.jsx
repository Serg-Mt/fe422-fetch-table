import classes from './ObjTable.module.css';



export function ObjTable({ data, config }) {
  return <table className={classes.objtable}>
    <thead>
      <tr>
        {config.columns.map(c => <td key={c.title}>{c.title}</td>)}
      </tr>
    </thead>
    <tbody>
      {data.map(obj => <tr key={obj.id}>
        {config.columns.map(({ title, content }) => <td key={title}>
          {content(obj)}
        </td>)}
      </tr>)}
    </tbody>
  </table>
}