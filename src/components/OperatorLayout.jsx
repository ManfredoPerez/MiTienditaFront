import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarOperator from './NavbarOperator';


const OperatorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <NavbarOperator collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`main-content ${collapsed ? 'content-expanded' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;

