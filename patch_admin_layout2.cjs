const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.jsx', 'utf8');

// The previous patch failed cleanly because 'const navigation =' didn't exist.
// Let's add the link to navItems.
const newLink = "    { to: '/admin/shortcuts', label: 'الرئيسية', icon: Home },\n";
code = code.replace("const navItems = [", "const navItems = [\n" + newLink);

fs.writeFileSync('src/components/admin/AdminLayout.jsx', code);
