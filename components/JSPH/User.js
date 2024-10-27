import classes from './User.module.css';

export default function User({ user }) {
  const {
    id, name, username, email,
    address: { street, suite, city, zipcode, geo: { lat, lng } },
    phone, website,
    company: {
      name: cname,
      catchPhrase,
      bs
    }
  } = user;

  return (
    <>
      <fieldset className={classes.usercard}>
        <legend>#{id} {username}</legend>
        <dl>
          <dt>📛name</dt>
          <dd>{name}</dd>
          <dt>📧email</dt>
          <dd> <a href={`mailto:${email}`}>{email}</a></dd>
          <dt>📞phone</dt>
          <dd><a href={`tel:${phone}`}>{phone}</a></dd>
          <dt>🌐site</dt>
          <dd><a href={`http://${website}`}>{website}</a></dd>
          <dt>🏦address</dt>
          <dd title={zipcode}>
            <a href={`https://maps.google.com/maps?ll=${lat},${lng}`}>{street},{suite},{city}
            </a>
          </dd>
          <dt>🏭company</dt>
          <dd>{cname}</dd>
          <dt>💬catch phrase</dt>
          <dd>{catchPhrase}</dd>
        </dl>
      </fieldset>
    </>
  );
}