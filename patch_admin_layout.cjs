const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.jsx', 'utf8');

const shortcutLink = `
    {
      name: 'الصفحة الرئيسية',
      path: '/admin/shortcuts',
      icon: LayoutDashboard,
      description: 'إدارة اختصارات الرئيسية'
    },
`;

code = code.replace("const navigation = [", "const navigation = [" + shortcutLink);

// Add LayoutDashboard to imports if not there
if (!code.includes('LayoutDashboard')) {
  code = code.replace('import {', 'import { LayoutDashboard,');
}

fs.writeFileSync('src/components/admin/AdminLayout.jsx', code);
