import Link from 'next/link';

const TopMenu = () => {
  return (
    <nav className="top-menu">
  <Link href="/" className="top-menu-item">Home</Link>
      <Link href="/nsw" className="top-menu-item">NSW</Link>
      <Link href="/vic" className="top-menu-item">VIC</Link>
      <Link href="/qld" className="top-menu-item">QLD</Link>
    </nav>
  );
};

export default TopMenu;
