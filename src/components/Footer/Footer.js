import { useGithub } from '@/providers/Github/Github';

export default function Footer() {
  const { meta } = useGithub();

  return (
    <footer className="w-full py-4 text-center text-sm text-gray-600">
      <span>
        © {new Date().getFullYear()} Bruno Software Inc
      </span>

      {meta?.updatedAt && (
        <span className="ml-2 mr-2">
          |
        </span>
      )}

      {meta?.updatedAt && (
        <span >
          Last refreshed at {new Date(meta.updatedAt).toLocaleString()}
        </span>
      )}
    </footer>
  );
}
