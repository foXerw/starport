export interface NavLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  group: 'main' | 'dock' | 'elsewhere';
}

export const navLinks: NavLink[] = [
  { label: '关于我', href: '/about', group: 'main' },
  { label: '生活随笔', href: '/essays', group: 'main' },
  { label: '博客', href: 'https://blog.foxerw.com', external: true, group: 'dock', description: '长文与技术' },
  { label: '便签', href: 'https://notes.foxerw.com', external: true, group: 'dock', description: '随手记' },
  { label: 'GitHub', href: 'https://github.com/foXerw', external: true, group: 'elsewhere' },
];
