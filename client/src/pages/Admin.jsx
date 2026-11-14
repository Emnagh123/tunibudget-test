export default function Admin({ user, users, setUsers, audit, log }) {
  const isAdmin = user.role === 'admin';
  const update = (id, changes) => { setUsers(users.map((u) => (u.id === id ? { ...u, ...changes } : u))); log('UPDATE', 'User'); };
  return (
    <>
      <h1>{isAdmin ? 'Admin panel' : 'Audit log (read-only)'}</h1>
      {isAdmin && <div className="card"><h3>Users</h3><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u.id}><td>{u.name}</td><td>{u.email}</td>
            <td><select value={u.role} onChange={(e) => update(u.id, { role: e.target.value })}>
              <option>user</option><option>auditor</option><option>admin</option></select></td>
            <td><button className={u.active ? 'danger' : 'ghost'} onClick={() => update(u.id, { active: !u.active })}>
              {u.active ? 'Disable' : 'Enable'}</button></td></tr>))}
        </tbody></table></div>}
      <div className="card"><h3>Audit log — who did what, when</h3><table>
        <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Entity</th></tr></thead>
        <tbody>{audit.map((a) => <tr key={a.id}><td>{a.when}</td><td>{a.actor}</td><td>{a.action}</td><td>{a.entity}</td></tr>)}</tbody>
      </table></div>
    </>
  );
}
