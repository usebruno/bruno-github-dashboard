import Link from 'next/link';
import { useRouter } from 'next/router';
import Stats from './stats';
import Modules from './modules';
import Assignees from './assignees';
import Reporters from './reporters';
import Timeline from './timeline';

export default function Issues() {
  const router = useRouter();
  const tab = router.query.tab || 'stats';

  // Navigation items
  const navItems = [
    { name: 'Stats', path: '?tab=stats' },
    { name: 'Modules', path: '?tab=modules' },
    { name: 'Assignees', path: '?tab=assignees' },
    { name: 'Timeline', path: '?tab=timeline' },
    { name: 'Reporters', path: '?tab=reporters' },
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
      {tab === 'modules' && <Modules />}
      {tab === 'assignees' && <Assignees />}
      {tab === 'timeline' && <Timeline />}
      {tab === 'reporters' && <Reporters />}
    </div>
  );
}