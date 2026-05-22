import "./Footer.css";

const FOOTER_DATA = {
  brand: {
    name: "Tourism AI",
    description:
      "Descubre experiencias personalizadas con inteligencia artificial.",
  },
  sections: [
    {
      title: "Explorar",
      links: [
        { label: "Inicio", href: "/" },
        { label: "Planes", href: "/plans" },
        { label: "Mapa", href: "/map" },
      ],
    },
    {
      title: "Cuenta",
      links: [
        { label: "Iniciar sesión", href: "/login" },
        { label: "Crear cuenta", href: "/register" },
      ],
    },
  ],
  contact: {
    email: "soporte@tourismai.com",
    location: "Bogotá, Colombia",
  },
};

function FooterSection({ title, links }) {
  return (
    <div className="footer-section">
      <h4>{title}</h4>
      <nav aria-label={title}>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-section">
          <h2 className="footer-logo">
            {FOOTER_DATA.brand.name}
          </h2>
          <p>{FOOTER_DATA.brand.description}</p>
        </div>

        {/* SECTIONS */}
        {FOOTER_DATA.sections.map((section) => (
          <FooterSection
            key={section.title}
            title={section.title}
            links={section.links}
          />
        ))}

        {/* CONTACT */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <address>
            <p>
              <a href={`mailto:${FOOTER_DATA.contact.email}`}>
                {FOOTER_DATA.contact.email}
              </a>
            </p>
            <p>{FOOTER_DATA.contact.location}</p>
          </address>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © {year} {FOOTER_DATA.brand.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}