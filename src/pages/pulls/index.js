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
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  px-1 py-2 text-sm font-medium transition-colors relative
                  ${tab === item.path.split('=')[1]
                    ? 'text-yellow-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-800'
                  }
                  ${tab === item.path.split('=')[1] 
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-600' 
                    : 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-transparent hover:after:bg-gray-200'
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
