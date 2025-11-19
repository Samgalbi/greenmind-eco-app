import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar, Award, Leaf, Trophy, Zap, Target, CheckCircle } from 'lucide-react';

interface UserProfileProps {
  userPoints: number;
}

export function UserProfile({ userPoints }: UserProfileProps) {
  const userLevel = Math.floor(userPoints / 100);
  const nextLevelPoints = (userLevel + 1) * 100;
  const progressToNextLevel = ((userPoints % 100) / 100) * 100;

  const allBadges = [
    { id: 1, name: 'Éco-Débutant', description: 'Premiers pas dans l\'écologie', icon: '🌱', unlocked: true, date: '15 Oct 2024' },
    { id: 2, name: 'Économiseur d\'Eau', description: '10 missions d\'économie d\'eau', icon: '💧', unlocked: true, date: '22 Oct 2024' },
    { id: 3, name: 'Recycleur Pro', description: '15 missions de recyclage', icon: '♻️', unlocked: true, date: '28 Oct 2024' },
    { id: 4, name: 'Éco-Warrior', description: '50 missions complétées', icon: '⚡', unlocked: false, date: null },
    { id: 5, name: 'Champion Vert', description: '100 missions complétées', icon: '🏆', unlocked: false, date: null },
    { id: 6, name: 'Maître de l\'Énergie', description: '20 missions d\'économie d\'énergie', icon: '⚡', unlocked: false, date: null },
    { id: 7, name: 'Ambassadeur CO₂', description: 'Réduire 500kg de CO₂', icon: '🌍', unlocked: false, date: null },
    { id: 8, name: 'Légende Écologique', description: '200 missions complétées', icon: '👑', unlocked: false, date: null },
  ];

  const stats = [
    { label: 'Jours consécutifs', value: '5', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Missions réussies', value: '12', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Quiz complétés', value: '8', icon: Trophy, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'CO₂ réduit', value: '135kg', icon: Leaf, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  const recentActivity = [
    { id: 1, type: 'mission', title: 'Transport vert complété', points: 200, date: '3 Nov 2024', icon: Target },
    { id: 2, type: 'quiz', title: 'Quiz "Économie d\'énergie" réussi', points: 75, date: '2 Nov 2024', icon: Award },
    { id: 3, type: 'mission', title: 'Économiser l\'eau - Jour 3/3', points: 100, date: '1 Nov 2024', icon: Target },
    { id: 4, type: 'badge', title: 'Badge "Recycleur Pro" débloqué', points: 0, date: '28 Oct 2024', icon: Award },
    { id: 5, type: 'quiz', title: 'Quiz "Les bases du recyclage" réussi', points: 50, date: '25 Oct 2024', icon: Award },
  ];

  const unlockedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-green-900 mb-2">Mon Profil</h2>
        <p className="text-gray-600">
          Suivez votre progression et vos accomplissements
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white">
                  <AvatarFallback className="text-2xl bg-green-700 text-white">
                    VC
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-white mb-1">Vous</h3>
                <p className="text-green-100 text-sm mb-4">Membre depuis Oct 2024</p>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <p className="text-green-100 text-sm mb-1">Niveau</p>
                  <p className="text-3xl text-white">{userLevel}</p>
                  <p className="text-green-100 text-sm mt-2">Éco-Citoyen</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-green-100 text-sm mb-1">Points totaux</p>
                  <p className="text-3xl text-white">{userPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className={`${stat.bgColor} rounded-lg p-3 mb-2`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xl text-gray-900">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column - Badges & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Progression vers le niveau suivant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Niveau {userLevel}</span>
                  <span className="text-green-700">{userPoints} / {nextLevelPoints} pts</span>
                  <span className="text-gray-600">Niveau {userLevel + 1}</span>
                </div>
                <Progress value={progressToNextLevel} className="h-3" />
                <p className="text-sm text-gray-600 text-center">
                  Plus que {nextLevelPoints - userPoints} points pour passer au niveau supérieur
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">
                Badges ({unlockedBadges.length}/{allBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unlocked Badges */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">Badges débloqués</p>
                  <div className="grid grid-cols-3 gap-4">
                    {unlockedBadges.map((badge) => (
                      <div key={badge.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <p className="text-sm text-green-900">{badge.name}</p>
                        <p className="text-xs text-green-600 mt-1">{badge.description}</p>
                        {badge.date && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {badge.date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locked Badges */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">À débloquer</p>
                  <div className="grid grid-cols-3 gap-4">
                    {lockedBadges.map((badge) => (
                      <div key={badge.id} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center opacity-60">
                        <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                        <p className="text-sm text-gray-700">{badge.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'mission' ? 'bg-green-100' :
                        activity.type === 'quiz' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          activity.type === 'mission' ? 'text-green-600' :
                          activity.type === 'quiz' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                      {activity.points > 0 && (
                        <Badge className="bg-green-100 text-green-700">
                          +{activity.points} pts
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
