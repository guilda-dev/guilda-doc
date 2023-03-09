import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';



const NavBar = () => {
  const [activeLink, setActiveLink] = useState('');
  const { t } = useTranslation();
  const links = [
    { name: 'Home', url: '/' },
    { name: 'Profile', url: '/profile' },
    { name: 'Settings', url: '/settings' },
  ];

  useEffect(() => {
    // Set active link based on URL
    const pathname = window.location.pathname;
    const link = links.find(link => link.url === pathname);
    setActiveLink(link ? link.name : '');
  }, [links]);

  return (
    <nav>
      <div className="logo">{ t('test.test') }</div>
      <ul>
        {links.map(link => (
          <li key={link.url} className={link.name === activeLink ? 'active' : ''}>
            <a href={link.url} onClick={() => setActiveLink(link.name)}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;