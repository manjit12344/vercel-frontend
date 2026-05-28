const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">

        <div className="row gy-4">

          {/* Brand */}
          <div className="col-12 col-md-5">
            <h5 className="fw-bold">YourBrand</h5>
            <p className="text-secondary small">
              We build modern, scalable, and user-friendly web applications.
              Delivering quality experiences since day one.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-semibold small mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-secondary">Home</a></li>
              <li><a href="/about" className="text-decoration-none text-secondary">About</a></li>
              <li><a href="/services" className="text-decoration-none text-secondary">Services</a></li>
              <li><a href="/contact" className="text-decoration-none text-secondary">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-6 col-md-3">
            <h6 className="text-uppercase fw-semibold small mb-3">Contact</h6>
            <p className="small text-secondary mb-1">
              <i className="bi bi-geo-alt-fill me-2"></i>Punjab, India
            </p>
            <p className="small text-secondary mb-1">
              <i className="bi bi-telephone-fill me-2"></i>+91 90416 27495
            </p>
            <p className="small text-secondary mb-0">
              <i className="bi bi-envelope-fill me-2"></i>manjit25986@gmail.com
            </p>
          </div>

          {/* Social */}
          <div className="col-12 col-md-2">
            <h6 className="text-uppercase fw-semibold small mb-3">Follow us On</h6>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="https://github.com/terabhaiseedhemaut/My_project_Partial" className="btn btn-outline-light btn-sm">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <span>
            © {currentYear} <span className="fw-semibold text-light">YourBrand</span>. All rights reserved.
          </span>

          <div className="d-flex gap-3 mt-2 mt-md-0">
            <a href="/privacy" className="text-decoration-none text-secondary">Privacy</a>
            <a href="/terms" className="text-decoration-none text-secondary">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;  