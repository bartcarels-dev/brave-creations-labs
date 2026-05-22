export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        © {year} Tinker Department · Built with curiosity
      </p>
    </footer>
  )
}
