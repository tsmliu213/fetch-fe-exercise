import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Dog } from '@/types';

interface MatchProps {
  matchedDog: Dog | null;
}

export default function Match({ matchedDog }: MatchProps) {
  if (!matchedDog) {
    return <Navigate to="/search" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Congratulations!</h1>
        <p className="text-xl text-gray-600">You've been matched with the perfect companion!</p>
      </div>

      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative pb-[56.25%]">
          <img 
            src={matchedDog.img} 
            alt={`${matchedDog.name} - ${matchedDog.breed}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-4">{matchedDog.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Breed:</span> {matchedDog.breed}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Age:</span> {matchedDog.age} years
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Location:</span> {matchedDog.zip_code}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-600">
            <p>We think {matchedDog.name} would be a perfect addition to your family!</p>
            <p className="mt-2">Contact the shelter using the location information above to proceed with the adoption process.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}