const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const importStatement = `
import { contentService } from '../services/contentService';
`;

code = code.replace("import PsychologyInsightsBanner", importStatement + "import PsychologyInsightsBanner");

const stateStatements = `
  const [shortcuts, setShortcuts] = useState([]);
  
  useEffect(() => {
    const fetchShortcuts = async () => {
      const data = await contentService.getHomepageShortcuts();
      setShortcuts(data || []);
    };
    fetchShortcuts();
  }, []);
`;

code = code.replace("const [showTasks, setShowTasks] = useState(false);", "const [showTasks, setShowTasks] = useState(false);\n" + stateStatements);

const shortcutsRender = `
        {shortcuts.length > 0 && (
          <div className="space-y-8">
            {shortcuts.map(sc => (
              <section key={sc.id} className="space-y-6">
                <div className="border-b border-border-medium pb-2">
                  <h3 className="font-display text-xl font-bold text-text-primary mt-4">
                    {sc.title}
                  </h3>
                  {sc.description && (
                    <p className="text-text-secondary text-sm mt-1 font-sans">
                      {sc.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sc.items.map(item => {
                    const content = item.content;
                    if (!content) return null;
                    return (
                      <NavLink
                        key={item.id}
                        to={\`/c/\${content.slug}\`}
                        className="group flex flex-col p-6 rounded-sm bg-bg-surface border border-border-medium hover:border-accent-primary shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="size-10 rounded-sm bg-bg-app border border-border-subtle flex items-center justify-center text-accent-primary shrink-0 transition-colors">
                            <BookOpen className="size-5" />
                          </div>
                          <span className="font-space-mono text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            {content.content_type || 'مقال'}
                          </span>
                        </div>
                        <div className="space-y-2 mt-auto">
                          <h4 className="font-display text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                            {content.title}
                          </h4>
                          {content.description && (
                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                              {content.description}
                            </p>
                          )}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
`;

code = code.replace("<PsychologyInsightsBanner />", "<PsychologyInsightsBanner />\n" + shortcutsRender);

fs.writeFileSync('src/pages/Home.jsx', code);
