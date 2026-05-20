export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>
        © {year} Brave Creations Labs · Built with curiosity
      </p>
    </footer>
  )
}
