import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex text-sm text-gray-600 mb-6">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-400">/</span>}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
