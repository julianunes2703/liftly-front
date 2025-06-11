import React from 'react';
import './menu-lateral.css';
import LogoLiftly from '../../components/liftly/liftly';


function Menu({ links = [] }) {
  return (
    <aside className="sidebar">
      <div className="menu-logo">
        <LogoLiftly color='white'/>
      </div>

      <nav className="menu-links">
        {links.map((link, index) => (
          <a key={index} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}


export default Menu;
