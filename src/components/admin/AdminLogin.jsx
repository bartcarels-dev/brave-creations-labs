export default function AdminLogin({ onLogin, error }) {
  function handleSubmit(e) {
    e.preventDefault()
    const password = e.target.password.value
    onLogin(password)
  }

  return (
    <div className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <h2 className="admin-login__title">Admin sign in</h2>
        <p className="admin-login__hint">
          Enter your admin password to manage projects.
        </p>
        <label className="admin-field">
          <span className="admin-field__label">Password</span>
          <input
            className="admin-field__input"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="admin-login__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="admin-btn admin-btn--primary">
          Sign in
        </button>
      </form>
    </div>
  )
}
