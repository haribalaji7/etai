export interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  department: string;
  status: 'active' | 'inactive' | 'away';
  score: number;
  email: string;
}

export const sampleUsers: User[] = [
  { id:1, name:'Sarah Chen', role:'Manager', avatar:'https://ui-avatars.com/api/?name=Sarah+Chen&background=random', department:'Engineering', status:'active', score:94, email:'sarah@nexusai.com' },
  { id:2, name:'Marcus Williams', role:'Employee', avatar:'https://ui-avatars.com/api/?name=Marcus+Williams&background=random', department:'Sales', status:'active', score:87, email:'marcus@nexusai.com' },
  { id:3, name:'Priya Patel', role:'HR Lead', avatar:'https://ui-avatars.com/api/?name=Priya+Patel&background=random', department:'HR', status:'active', score:91, email:'priya@nexusai.com' },
  { id:4, name:'James Rodriguez', role:'Engineer', avatar:'https://ui-avatars.com/api/?name=James+Rodriguez&background=random', department:'Engineering', status:'active', score:89, email:'james@nexusai.com' },
  { id:5, name:'Aisha Mohammed', role:'Designer', avatar:'https://ui-avatars.com/api/?name=Aisha+Mohammed&background=random', department:'Design', status:'away', score:92, email:'aisha@nexusai.com' },
  { id:6, name:'David Kim', role:'Data Analyst', avatar:'https://ui-avatars.com/api/?name=David+Kim&background=random', department:'Analytics', status:'active', score:88, email:'david@nexusai.com' },
  { id:7, name:'Elena Volkov', role:'PM', avatar:'https://ui-avatars.com/api/?name=Elena+Volkov&background=random', department:'Product', status:'active', score:95, email:'elena@nexusai.com' },
  { id:8, name:'Carlos Rivera', role:'DevOps', avatar:'https://ui-avatars.com/api/?name=Carlos+Rivera&background=random', department:'Engineering', status:'active', score:86, email:'carlos@nexusai.com' },
  { id:9, name:'Mei Zhang', role:'QA Lead', avatar:'https://ui-avatars.com/api/?name=Mei+Zhang&background=random', department:'Engineering', status:'inactive', score:90, email:'mei@nexusai.com' },
  { id:10, name:'Alex Thompson', role:'CTO', avatar:'https://ui-avatars.com/api/?name=Alex+Thompson&background=random', department:'Executive', status:'active', score:97, email:'alex@nexusai.com' },
  { id:11, name:'Fatima Hassan', role:'Marketing', avatar:'https://ui-avatars.com/api/?name=Fatima+Hassan&background=random', department:'Marketing', status:'active', score:85, email:'fatima@nexusai.com' },
  { id:12, name:'Ryan O\'Brien', role:'Sales Lead', avatar:'https://ui-avatars.com/api/?name=Ryan+O+Brien&background=random', department:'Sales', status:'active', score:93, email:'ryan@nexusai.com' },
  { id:13, name:'Yuki Tanaka', role:'AI Engineer', avatar:'https://ui-avatars.com/api/?name=Yuki+Tanaka&background=random', department:'AI', status:'active', score:96, email:'yuki@nexusai.com' },
  { id:14, name:'Sofia Martinez', role:'Frontend', avatar:'https://ui-avatars.com/api/?name=Sofia+Martinez&background=random', department:'Engineering', status:'away', score:88, email:'sofia@nexusai.com' },
  { id:15, name:'Omar Ali', role:'Backend', avatar:'https://ui-avatars.com/api/?name=Omar+Ali&background=random', department:'Engineering', status:'active', score:91, email:'omar@nexusai.com' },
  { id:16, name:'Lisa Wang', role:'Finance', avatar:'https://ui-avatars.com/api/?name=Lisa+Wang&background=random', department:'Finance', status:'active', score:89, email:'lisa@nexusai.com' },
  { id:17, name:'Noah Davis', role:'Support', avatar:'https://ui-avatars.com/api/?name=Noah+Davis&background=random', department:'Support', status:'active', score:84, email:'noah@nexusai.com' },
  { id:18, name:'Zara Khan', role:'Legal', avatar:'https://ui-avatars.com/api/?name=Zara+Khan&background=random', department:'Legal', status:'active', score:90, email:'zara@nexusai.com' },
  { id:19, name:'Liam Foster', role:'Intern', avatar:'https://ui-avatars.com/api/?name=Liam+Foster&background=random', department:'Engineering', status:'active', score:78, email:'liam@nexusai.com' },
  { id:20, name:'Ava Wilson', role:'CEO', avatar:'https://ui-avatars.com/api/?name=Ava+Wilson&background=random', department:'Executive', status:'active', score:98, email:'ava@nexusai.com' },
];

export const revenueData = [
  { month:'Jan', revenue:180000, expenses:120000, profit:60000 },
  { month:'Feb', revenue:195000, expenses:125000, profit:70000 },
  { month:'Mar', revenue:210000, expenses:130000, profit:80000 },
  { month:'Apr', revenue:198000, expenses:128000, profit:70000 },
  { month:'May', revenue:225000, expenses:135000, profit:90000 },
  { month:'Jun', revenue:240000, expenses:140000, profit:100000 },
  { month:'Jul', revenue:255000, expenses:145000, profit:110000 },
  { month:'Aug', revenue:238000, expenses:142000, profit:96000 },
  { month:'Sep', revenue:270000, expenses:150000, profit:120000 },
  { month:'Oct', revenue:285000, expenses:155000, profit:130000 },
  { month:'Nov', revenue:310000, expenses:160000, profit:150000 },
  { month:'Dec', revenue:340000, expenses:170000, profit:170000 },
];

export const userGrowthData = [
  { month:'Jan', newUsers:120, churn:15 },
  { month:'Feb', newUsers:145, churn:12 },
  { month:'Mar', newUsers:160, churn:18 },
  { month:'Apr', newUsers:175, churn:14 },
  { month:'May', newUsers:190, churn:20 },
  { month:'Jun', newUsers:210, churn:16 },
  { month:'Jul', newUsers:235, churn:22 },
  { month:'Aug', newUsers:220, churn:19 },
  { month:'Sep', newUsers:260, churn:17 },
  { month:'Oct', newUsers:280, churn:21 },
  { month:'Nov', newUsers:310, churn:18 },
  { month:'Dec', newUsers:350, churn:15 },
];

export interface Agent {
  id: number;
  name: string;
  role: string;
  color: string;
  icon: string;
  status: 'idle' | 'running' | 'error';
  systemPrompt: string;
}

export const aiAgents: Agent[] = [
  { id:1, name:'Orchestrator', role:'Task Router', color:'#7c3aed', icon:'🧠', status:'running', systemPrompt:'You are the Orchestrator AI. Route tasks to the appropriate agent and coordinate workflows.' },
  { id:2, name:'Analyst', role:'Data Analysis', color:'#3b82f6', icon:'📊', status:'idle', systemPrompt:'You are a Data Analyst AI. Analyze data, find patterns, and generate insights.' },
  { id:3, name:'Writer', role:'Content Creation', color:'#10b981', icon:'✍️', status:'idle', systemPrompt:'You are a Content Writer AI. Create professional business content, emails, and reports.' },
  { id:4, name:'Coder', role:'Code Generation', color:'#f59e0b', icon:'💻', status:'idle', systemPrompt:'You are a Code Generation AI. Write clean, efficient code in any language.' },
  { id:5, name:'Researcher', role:'Research & RAG', color:'#ef4444', icon:'🔍', status:'idle', systemPrompt:'You are a Research AI. Find information, summarize documents, and answer questions with citations.' },
  { id:6, name:'Designer', role:'UI/UX Design', color:'#ec4899', icon:'🎨', status:'idle', systemPrompt:'You are a Design AI. Suggest UI/UX improvements and create design specifications.' },
  { id:7, name:'Planner', role:'Project Planning', color:'#8b5cf6', icon:'📋', status:'idle', systemPrompt:'You are a Project Planner AI. Create project plans, timelines, and task breakdowns.' },
  { id:8, name:'Auditor', role:'Compliance', color:'#06b6d4', icon:'🛡️', status:'idle', systemPrompt:'You are a Compliance Auditor AI. Review processes for compliance and suggest improvements.' },
  { id:9, name:'Financier', role:'Financial Analysis', color:'#84cc16', icon:'💰', status:'idle', systemPrompt:'You are a Financial AI. Analyze budgets, forecast revenue, and generate financial reports.' },
  { id:10, name:'HR Agent', role:'HR Operations', color:'#f97316', icon:'👥', status:'idle', systemPrompt:'You are an HR AI. Help with recruitment, performance reviews, and HR policies.' },
  { id:11, name:'Marketer', role:'Marketing', color:'#14b8a6', icon:'📢', status:'idle', systemPrompt:'You are a Marketing AI. Create marketing strategies, campaign plans, and ad copy.' },
  { id:12, name:'Supporter', role:'Customer Support', color:'#6366f1', icon:'🎧', status:'idle', systemPrompt:'You are a Customer Support AI. Handle customer inquiries and resolve issues professionally.' },
  { id:13, name:'Translator', role:'Translation', color:'#a855f7', icon:'🌐', status:'idle', systemPrompt:'You are a Translation AI. Translate content between languages accurately.' },
  { id:14, name:'Tester', role:'QA Testing', color:'#22c55e', icon:'🧪', status:'idle', systemPrompt:'You are a QA Testing AI. Write test cases, find bugs, and suggest quality improvements.' },
  { id:15, name:'Strategist', role:'Business Strategy', color:'#eab308', icon:'♟️', status:'idle', systemPrompt:'You are a Strategy AI. Analyze markets, competitors, and suggest business strategies.' },
];

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
}

export const generateAuditLogs = (count: number): AuditLog[] => {
  const actions = ['User Login','File Upload','Workflow Created','Report Generated','Settings Updated','User Invited','Task Completed','API Key Rotated','Role Changed','Data Exported'];
  const statuses: AuditLog['status'][] = ['success','success','success','warning','error'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: sampleUsers[i % sampleUsers.length].name,
    action: actions[i % actions.length],
    timestamp: new Date(Date.now() - i * 180000).toISOString(),
    status: statuses[i % statuses.length],
    ip: `192.168.${Math.floor(i / 256)}.${i % 256}`,
  }));
};

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: User;
  dueDate: string;
  tags: string[];
}

export const kanbanTasks: KanbanTask[] = [
  { id:'t1', title:'Design System Audit', description:'Review and update all design tokens and component styles for consistency.', status:'in-progress', priority:'high', assignee:sampleUsers[4], dueDate:'2024-12-20', tags:['design','urgent'] },
  { id:'t2', title:'API Rate Limiting', description:'Implement rate limiting on all public API endpoints using express-rate-limit.', status:'todo', priority:'high', assignee:sampleUsers[7], dueDate:'2024-12-18', tags:['backend','security'] },
  { id:'t3', title:'User Onboarding Flow', description:'Create multi-step onboarding wizard for new users with role selection.', status:'backlog', priority:'medium', assignee:sampleUsers[6], dueDate:'2024-12-25', tags:['frontend','ux'] },
  { id:'t4', title:'AI Model Fine-tuning', description:'Fine-tune the Analyst agent on company-specific financial data.', status:'review', priority:'high', assignee:sampleUsers[12], dueDate:'2024-12-15', tags:['ai','data'] },
  { id:'t5', title:'Dashboard Performance', description:'Optimize dashboard rendering with virtualized lists and lazy loading.', status:'in-progress', priority:'medium', assignee:sampleUsers[13], dueDate:'2024-12-22', tags:['frontend','performance'] },
  { id:'t6', title:'Email Integration', description:'Connect SendGrid for transactional emails and notifications.', status:'todo', priority:'low', assignee:sampleUsers[14], dueDate:'2024-12-28', tags:['backend','integration'] },
  { id:'t7', title:'Mobile Responsive Fix', description:'Fix layout issues on mobile viewports for the workflow builder.', status:'backlog', priority:'medium', assignee:sampleUsers[4], dueDate:'2024-12-30', tags:['frontend','bug'] },
  { id:'t8', title:'Security Audit', description:'Conduct full security audit and penetration testing.', status:'done', priority:'high', assignee:sampleUsers[7], dueDate:'2024-12-10', tags:['security','compliance'] },
  { id:'t9', title:'Analytics Dashboard', description:'Build comprehensive analytics with date range filtering and PDF export.', status:'in-progress', priority:'medium', assignee:sampleUsers[5], dueDate:'2024-12-24', tags:['frontend','analytics'] },
  { id:'t10', title:'Documentation Update', description:'Update API docs and add usage examples for all endpoints.', status:'todo', priority:'low', assignee:sampleUsers[2], dueDate:'2024-12-31', tags:['docs'] },
];

export const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'AI Assistant', href: '/ai', icon: 'Bot' },
  { label: 'Workflows', href: '/workflows/builder', icon: 'GitBranch' },
  { label: 'Projects', href: '/projects', icon: 'FolderKanban' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { label: 'Documents', href: '/documents', icon: 'FileText' },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { label: 'HR', href: '/hr', icon: 'Users' },
  { label: 'Finance', href: '/finance', icon: 'DollarSign' },
  { label: 'CRM', href: '/crm', icon: 'Target' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
  { label: 'Help', href: '/help', icon: 'HelpCircle' },
];

export const faqItems = [
  { q: 'What is NexusAI?', a: 'NexusAI is an AI-powered autonomous enterprise workflow platform that uses 15 specialized AI agents to automate business processes, analyze data, and boost productivity by 10x.' },
  { q: 'How do AI Agents work?', a: 'Each AI agent is specialized for a specific domain (analytics, writing, coding, etc.). The Orchestrator agent routes tasks to the right specialist, and they can collaborate on complex workflows.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use end-to-end encryption, SOC 2 Type II compliance, and your data never leaves your chosen region. All AI processing happens within isolated environments.' },
  { q: 'Can I integrate with existing tools?', a: 'Yes, NexusAI integrates with 200+ tools including Slack, Jira, Salesforce, HubSpot, Google Workspace, and custom APIs via webhooks.' },
  { q: 'What does the free trial include?', a: 'The 14-day free trial includes full access to all Professional plan features, 5 AI agents, and 1000 workflow executions.' },
  { q: 'How does billing work?', a: 'We offer monthly and annual billing. Annual plans save 20%. You can upgrade, downgrade, or cancel anytime.' },
];
