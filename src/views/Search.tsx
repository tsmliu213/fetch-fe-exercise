import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export default function Search() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        // First, get the dog IDs from the search endpoint
        const searchResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/search?sort=breed:asc', {
          credentials: 'include'
        });
        
        if (!searchResponse.ok) throw new Error('Failed to fetch dog IDs');
        
        const searchData = await searchResponse.json();
        
        // Then, fetch the actual dog data using the IDs
        const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(searchData.resultIds)
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

    fetchDogs();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Dogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
}