import { useEffect, useState } from 'react';

interface DogFiltersProps {
  selectedBreeds: string[];
  onBreedsChange: (selectedBreeds: string[]) => void;
}

export function DogFilters({ selectedBreeds, onBreedsChange }: DogFiltersProps) {
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
      <h2 className="text-lg font-semibold mb-4">Filter by Breed</h2>
      <div className="space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {breeds.map((breed) => (
          <div key={breed} className="flex items-center space-x-2">
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