import { useEffect, useState } from 'react';

interface DogFiltersProps {
  selectedBreeds: string[];
  onBreedsChange: (selectedBreeds: string[]) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function DogFilters({ selectedBreeds, onBreedsChange, sortOrder, onSortOrderChange }: DogFiltersProps) {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch breeds');
        
        const data = await response.json();
        setBreeds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  const handleBreedChange = (breed: string) => {
    const updatedBreeds = selectedBreeds.includes(breed)
      ? selectedBreeds.filter(b => b !== breed)
      : [...selectedBreeds, breed];
    
    onBreedsChange(updatedBreeds);
  };

  if (loading) return <div className="p-4">Loading breeds...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-64 bg-white p-4 border-r min-h-screen">
      <div className="mb-6">
        <label htmlFor="sort-order" className="block text-lg font-semibold mb-2">
          Sort by Breed
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">A to Z</option>
          <option value="desc">Z to A</option>
        </select>
      </div>
      <h2 className="text-lg font-semibold mb-4">Filter by Breed</h2>
      <div className="space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {breeds.map((breed) => (
          <div key={breed} className="flex items-center text-left space-x-2">
            <input
              type="checkbox"
              id={breed}
              checked={selectedBreeds.includes(breed)}
              onChange={() => handleBreedChange(breed)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor={breed}
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {breed}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}