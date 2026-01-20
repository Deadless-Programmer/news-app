// app/components/CategorySelector.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/data/categories';

export default function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-10 text-center">
      <label htmlFor="category-select" className="mr-3 text-lg font-medium text-gray-700">
        Filter by Category:
      </label>
      <select
        id="category-select"
        value={currentCategory}
        onChange={handleChange}
        className="px-5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
      >
        {categories.map((cat) => (
          <option key={cat.code} value={cat.code}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}