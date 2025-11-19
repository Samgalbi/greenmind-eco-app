import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, Leaf, Award, Droplet, Recycle, Zap, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MissionsProps {
  onComplete: (points: number, co2: number) => void;
}

const missionsData = [
  {
    id: 1,
    title: 'Économiser l\'eau',
    description: 'Prenez une douche de moins de 5 minutes pendant 3 jours',
    icon: Droplet,
    category: 'Eau',
    duration: '3 jours',
    points: 100,
    co2Impact: 12,
    difficulty: 'Facile',
    progress: 0,
    total: 3,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Zéro déchet aujourd\'hui',
    description: 'Ne produisez aucun déchet non recyclable pendant une journée',
    icon: Recycle,
    category: 'Déchets',
    duration: '1 jour',
    points: 150,
    co2Impact: 20,
    difficulty: 'Moyen',
    progress: 0,
    total: 1,
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Transport vert',
    description: 'Utilisez les transports en commun ou le vélo pendant 5 jours',
    icon: Leaf,
    category: 'Transport',
    duration: '5 jours',
    points: 200,
    co2Impact: 35,
    difficulty: 'Moyen',
    progress: 0,
    total: 5,
    color: 'bg-emerald-500',
  },
  {
    id: 4,
    title: 'Débrancher pour économiser',
    description: 'Débranchez tous les appareils en veille le soir pendant une semaine',
    icon: Zap,
    category: 'Énergie',
    duration: '7 jours',
    points: 120,
    co2Impact: 15,
    difficulty: 'Facile',
    progress: 0,
    total: 7,
    color: 'bg-yellow-500',
  },
  {
    id: 5,
    title: 'Courses responsables',
    description: 'Achetez uniquement des produits locaux et de saison',
    icon: ShoppingBag,
    category: 'Alimentation',
    duration: '3 jours',
    points: 130,
    co2Impact: 18,
    difficulty: 'Moyen',
    progress: 0,
    total: 3,
    color: 'bg-purple-500',
  },
  {
    id: 6,
    title: 'Champion de l\'énergie',
    description: 'Réduisez votre consommation électrique de 20%',
    icon: Zap,
    category: 'Énergie',
    duration: '7 jours',
    points: 250,
    co2Impact: 40,
    difficulty: 'Difficile',
    progress: 0,
    total: 7,
    color: 'bg-orange-500',
  },
];

export function Missions({ onComplete }: MissionsProps) {
  const [missions, setMissions] = useState(missionsData);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'Eau', 'Déchets', 'Transport', 'Énergie', 'Alimentation'];

  const handleProgressUpdate = (missionId: number) => {
    setMissions(missions.map(mission => {
      if (mission.id === missionId && mission.progress < mission.total) {
        const newProgress = mission.progress + 1;
        
        if (newProgress === mission.total) {
          onComplete(mission.points, mission.co2Impact);
          toast.success(`Mission accomplie ! +${mission.points} points`, {
            description: `Vous avez réduit ${mission.co2Impact}kg de CO₂ !`,
          });
        } else {
          toast.success('Progrès enregistré !', {
            description: `${newProgress}/${mission.total} jours complétés`,
          });
        }

        return { ...mission, progress: newProgress };
      }
      return mission;
    }));
  };

  const filteredMissions = filter === 'all' 
    ? missions 
    : missions.filter(m => m.category === filter);

  const activeMissions = missions.filter(m => m.progress > 0 && m.progress < m.total);
  const completedMissions = missions.filter(m => m.progress === m.total);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-green-900 mb-2">Missions écologiques</h2>
        <p className="text-gray-600 mb-4">
          Relevez des défis quotidiens pour réduire votre empreinte carbone
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-green-600">{activeMissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-blue-600">{completedMissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Complétées</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-purple-600">{missions.length - completedMissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Disponibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setFilter(category)}
              variant={filter === category ? 'default' : 'outline'}
              className={filter === category ? 'bg-green-600 hover:bg-green-700' : ''}
              size="sm"
            >
              {category === 'all' ? 'Toutes' : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => {
          const Icon = mission.icon;
          const progressPercent = (mission.progress / mission.total) * 100;
          const isCompleted = mission.progress === mission.total;
          const isStarted = mission.progress > 0;

          return (
            <Card 
              key={mission.id} 
              className={`hover:shadow-lg transition-shadow ${
                isCompleted ? 'border-2 border-green-500 bg-green-50' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`${mission.color} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-green-900">{mission.title}</CardTitle>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <CardDescription>{mission.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    {mission.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {mission.category}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    <Clock className="w-3 h-3 mr-1" />
                    {mission.duration}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progression</span>
                    <span className="text-green-700">
                      {mission.progress} / {mission.total} jours
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{mission.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">-{mission.co2Impact}kg CO₂</span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <Button
                    onClick={() => handleProgressUpdate(mission.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isStarted ? 'Marquer le jour comme complété' : 'Commencer la mission'}
                  </Button>
                )}

                {isCompleted && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700">Mission accomplie ! 🎉</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
