const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/takeone.collective/',
    icon: 'photo_camera',
  },
  {
    label: 'SoundCloud',
    href: 'https://soundcloud.com/lonedbeats',
    icon: 'graphic_eq',
  },
  {
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/EWLF6rVxFi06d57XVu6B9s',
    icon: 'forum',
  },
] as const;

export function ContactSection() {
  return (
    <section id="contact" className="contact-stitch-section ambient-texture">
      <main className="contact-stitch-main">
        <div className="contact-stitch-container">
          <h1 className="contact-stitch-title contact-stitch-animate contact-stitch-delay-100">
            let&apos;s connect
          </h1>

          <div className="contact-stitch-grid">
            <div className="contact-stitch-glass-card contact-stitch-animate contact-stitch-delay-200">
              <h2 className="contact-stitch-card-heading">Email Us</h2>
              <p className="contact-stitch-card-body">
                For bookings, collaborations, or inquiries
              </p>
              <a
                href="mailto:take.one@outlook.it"
                className="contact-stitch-email-btn"
              >
                take.one@outlook.it
                <span className="contact-stitch-email-btn-glow" aria-hidden="true" />
              </a>
            </div>

            <div className="contact-stitch-glass-card contact-stitch-animate contact-stitch-delay-300">
              <h2 className="contact-stitch-card-heading">Follow The Vibe</h2>
              <p className="contact-stitch-card-body">
                Stay connected on social media
              </p>
              <div className="contact-stitch-social-row">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="contact-stitch-social-btn"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                      aria-hidden="true"
                    >
                      {icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="contact-stitch-tagline contact-stitch-animate contact-stitch-delay-400">
            Join us on the journey through sound, art, and culture
          </p>
        </div>
      </main>
    </section>
  );
}
