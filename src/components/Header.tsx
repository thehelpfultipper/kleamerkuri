import React, { useState, useEffect } from 'react';
import { Link, withPrefix } from 'gatsby';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { links } from '../helpers/variables';
import ThemeToggle from './UI/ThemeToggle';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Work', href: '/#projects' },
    { name: 'Eve', href: '/#eve' },
    { name: 'Writing', href: '/#blog' },
    { name: 'Tools', href: '/#products' },
    { name: 'Experience', href: '/#experience' },
    { name: 'About', href: '/#about' },
  ];

  const handleToggle = (expanded: boolean) => setIsMenuOpen(expanded);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Navbar
      as="header"
      expand="xl"
      variant="dark"
      className={`fixed-top z-3 ${isScrolled ? 'header-scrolled' : 'bg-transparent'}`}
      expanded={isMenuOpen}
      onToggle={handleToggle}>
      <Container className="container-px">
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={closeMenu}
          className="fs-5 fw-semibold text-slate-light text-decoration-none">
          <span className="d-none d-sm-inline">Klea Merkuri</span>
          <span className="d-sm-none font-monospace text-sky-blue">KM</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="mobileMenu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="p-0 border-0">
          <span
            className={`navbar-toggler-icon ${isMenuOpen ? 'navbar-toggler-icon-close' : 'navbar-toggler-icon-open'}`}></span>
        </Navbar.Toggle>

        <Navbar.Collapse
          id="mobileMenu"
          className="justify-content-end">
          <Nav aria-label="Primary navigation" className="align-items-xl-center text-center py-4 py-xl-0">
            {navLinks.map((link) => (
              <Nav.Link
                as="a"
                key={link.name}
                href={withPrefix(link.href)}
                onClick={closeMenu}
                className="header-link text-slate-light text-decoration-none my-2 my-xl-0 ms-xl-4">
                {link.name}
              </Nav.Link>
            ))}
            <a
              href={links.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${links.resume.text} (opens in new tab)`}
              className="btn btn-outline-sky-blue ms-xl-4 mt-3 mt-xl-0">
              {links.resume.text}
            </a>
            <div className="ms-xl-3 mt-3 mt-xl-0">
              <ThemeToggle />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
