import Link from 'next/link';
import { useRouter } from 'next/router';
import Stats from './stats';
import Authors from './authors';

export default function PullRequests() {
  const router = useRouter();
  const tab = router.query.tab || 'stats';

  // Navigation items
  const navItems = [
    { name: 'Stats', path: '?tab=stats' },
    { name: 'Authors', path: '?tab=authors' },
  ];

  return (
    <div className="px-4 py-2">
      {/* Navigation Bar */}
      <nav className="mb-8">
        <div className="max-w-2xl">
          <div className="flex space-x-4">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  text-sm
                  ${index === 0 ? 'pl-0' : 'px-1'}
                  ${tab === item.path.split('=')[1]
                    ? 'text-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {tab === 'stats' && <Stats />}
      {tab === 'authors' && <Authors />}
    </div>
  );
}
