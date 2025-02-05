import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DogFilters } from '@/components/DogFilters';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { Dog } from '@/types';

interface SearchProps {
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
  favoriteDogs: Dog[];
  onToggleFavorite: (dog: Dog) => void;
  onGenerateMatch: () => void;
  matchedDog: Dog | null;
}

export default function Search({ 
  selectedBreeds, 
  onBreedsChange, 
  favoriteDogs, 
  onToggleFavorite, 
  onGenerateMatch,
  matchedDog 
}: SearchProps) {

  const navigate = useNavigate();

  useEffect(() => {
    if (matchedDog) {
      navigate('/match');
    }
  }, [matchedDog, navigate]);

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    const fetchDogs = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const from = (page - 1) * ITEMS_PER_PAGE;
        const searchParams = new URLSearchParams({
          sort: `breed:${sortOrder}`,
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
        
        const dogsData: Dog[] = await dogsResponse.json();
        // Filter out dogs that are already in favorites with proper type checking
        const filteredDogsData = dogsData.filter((dog: Dog) => 
          !favoriteDogs.some((favDog: Dog) => favDog.id === dog.id)
        );
        setDogs(filteredDogsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dogs');
      } finally {
        setLoading(false);
      }
    };

    fetchDogs(currentPage);
  }, [currentPage, selectedBreeds, sortOrder, favoriteDogs]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex min-h-screen">
      <DogFilters 
        selectedBreeds={selectedBreeds}
        onBreedsChange={onBreedsChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      <div className="flex-1 p-8">
        {favoriteDogs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Favorite Dogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              {favoriteDogs.map((dog) => (
                <Card key={dog.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                  <button
                    onClick={() => onToggleFavorite(dog)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
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
            <Button
              onClick={onGenerateMatch}
              className="w-full max-w-md mx-auto block"
            >
              Generate Match
            </Button>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">Available Dogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <Card key={dog.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => onToggleFavorite(dog)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${favoriteDogs.some(d => d.id === dog.id) ? 'text-red-500 fill-current' : 'text-black stroke-current'}`}
                  viewBox="0 0 24 24"
                >
                  <path d={favoriteDogs.some(d => d.id === dog.id) ? 
                    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" :
                    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM12 4.79C10.91 3.69 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09"} />
                </svg>
              </button>
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