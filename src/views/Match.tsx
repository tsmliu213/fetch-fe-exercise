import { Card, CardContent } from '@/components/ui/card';
import { Dog } from '@/types';
import { useNavigate } from 'react-router-dom';

interface MatchProps {
  matchedDog: Dog | null;
  onClearMatch: () => void;
}

export default function Match({ matchedDog, onClearMatch }: MatchProps) {
  const navigate = useNavigate();

  if (!matchedDog) {
    navigate('/search', { replace: true });
    return null;
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

      <div className="mt-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            onClearMatch();
            navigate('/search', { replace: true });
          }}
          className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Find another match
        </button>
      </div>
    </div>
  );
}