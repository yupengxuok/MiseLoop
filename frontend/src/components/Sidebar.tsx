const navItems = ["Loop", "Context", "Agents", "Runs", "Review"];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="MiseLoop navigation">
      <div className="brand">
        <span className="brand-mark" />
        <span>MiseLoop</span>
      </div>

      <nav className="nav-list">
        {navItems.map((item, index) => (
          <a className={index === 0 ? "nav-item active" : "nav-item"} href="#" key={item}>
            <span className="nav-icon">{index + 1}</span>
            {item}
          </a>
        ))}
      </nav>

      <section className="sidebar-note">
        <p>Restaurant operating twin</p>
        <strong>Self-correcting prep plan</strong>
      </section>
    </aside>
  );
}
