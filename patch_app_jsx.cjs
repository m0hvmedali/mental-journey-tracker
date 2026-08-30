const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const importStatement = "import ShortcutsManager from './pages/admin/ShortcutsManager.jsx';\n";
code = code.replace("import AdminDashboard from './pages/admin/AdminDashboard.jsx';", importStatement + "import AdminDashboard from './pages/admin/AdminDashboard.jsx';");

const routeDefinition = `
        <Route
          path="/admin/shortcuts"
          element={
            <AdminRouteGuard>
              <ShortcutsManager />
            </AdminRouteGuard>
          }
        />`;

code = code.replace('<Route\n          path="/admin"\n          element={', routeDefinition + '\n        <Route\n          path="/admin"\n          element={');

fs.writeFileSync('src/App.jsx', code);
