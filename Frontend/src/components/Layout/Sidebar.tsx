import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/propietarios',
      label: 'Propietarios',
      icon: '👥'
    },
    {
      path: '/mascotas',
      label: 'Mascotas',
      icon: '🐕'
    },
    {
      path: '/veterinarios',
      label: 'Veterinarios',
      icon: '👨‍⚕️'
    },
    {
      path: '/citas',
      label: 'Citas',
      icon: '📅'
    }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                end={item.path === '/'}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};