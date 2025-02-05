import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogFilters } from '@/components/DogFilters';
import { Button } from '@/components/ui/button';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface SearchProps {
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
}

export default function Search({ selectedBreeds, onBreedsChange }: SearchProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    const fetchDogs = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const from = (page - 1) * ITEMS_PER_PAGE;
        const searchParams = new URLSearchParams({
          sort: 'breed:asc',
          size: '1000',
          from: from.toString()
        });

        if (selectedBreeds.length > 0) {
          selectedBreeds.forEach(breed => searchParams.append('breeds', breed));
        }

        const searchResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${searchParams}`, {
          credentials: 'include'
        });
        
        if (!searchResponse.ok) throw new Error('Failed to fetch dog IDs');
        
        const searchData = await searchResponse.json();
        setTotalResults(searchData.total);
        setTotalPages(Math.ceil(searchData.total / ITEMS_PER_PAGE));
        
        // Get the current page's worth of dogs
        const pageIds = searchData.resultIds.slice(0, ITEMS_PER_PAGE);
        
        // Then, fetch the actual dog data using the IDs
        const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(pageIds)
        });
        
        if (!dogsResponse.ok) throw new Error('Failed to fetch dogs');
        
        const dogsData = await dogsResponse.json();
        setDogs(dogsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dogs');
      } finally {
        setLoading(false);
      }
    };

    fetchDogs(currentPage);
  }, [currentPage, selectedBreeds]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <DogFilters 
        selectedBreeds={selectedBreeds}
        onBreedsChange={onBreedsChange}
      />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Available Dogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <Card key={dog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={dog.img} 
                alt={`${dog.name} - ${dog.breed}`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{dog.name}</h2>
                <p className="text-gray-600">Breed: {dog.breed}</p>
                <p className="text-gray-600">Age: {dog.age} years</p>
                <p className="text-gray-600">Location: {dog.zip_code}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-gray-600 mt-8 mb-4">
          Total Results: {totalResults}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}