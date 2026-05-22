export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__mark" aria-hidden="true">
          TD
        </span>
        <h1 className="header__title">Tinker Department</h1>
      </div>
      <p className="header__tagline">
        Experiments, prototypes and things currently being tinkered with.
      </p>
    </header>
  )
}
