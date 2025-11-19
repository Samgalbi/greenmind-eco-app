import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';

interface LeaderboardProps {
  currentUserPoints: number;
}

const leaderboardData = [
  { rank: 1, name: 'Marie Dubois', points: 2450, level: 24, country: 'FR', streak: 45, badge: '👑' },
  { rank: 2, name: 'Thomas Martin', points: 2280, level: 22, country: 'FR', streak: 38, badge: '🥈' },
  { rank: 3, name: 'Sophie Bernard', points: 2150, level: 21, country: 'BE', streak: 42, badge: '🥉' },
  { rank: 4, name: 'Lucas Petit', points: 1980, level: 19, country: 'FR', streak: 30, badge: '⭐' },
  { rank: 5, name: 'Emma Rousseau', points: 1850, level: 18, country: 'CH', streak: 28, badge: '⭐' },
  { rank: 6, name: 'Hugo Laurent', points: 1720, level: 17, country: 'FR', streak: 25, badge: '⭐' },
  { rank: 7, name: 'Chloé Moreau', points: 1650, level: 16, country: 'BE', streak: 22, badge: '⭐' },
  { rank: 8, name: 'Nathan Simon', points: 1540, level: 15, country: 'FR', streak: 20, badge: '⭐' },
  { rank: 9, name: 'Léa Fournier', points: 1420, level: 14, country: 'FR', streak: 18, badge: '⭐' },
  { rank: 10, name: 'Alexandre Girard', points: 1350, level: 13, country: 'CH', streak: 15, badge: '⭐' },
];

export function Leaderboard({ currentUserPoints }: LeaderboardProps) {
  const currentUserRank = leaderboardData.findIndex(user => user.points < currentUserPoints) + 1 || leaderboardData.length + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-green-900 mb-2">Classement mondial</h2>
        <p className="text-gray-600">
          Comparez vos performances avec les autres éco-citoyens
        </p>
      </div>

      {/* Current User Stats */}
      <Card className="mb-6 border-2 border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Votre position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 rounded-full p-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Classement</p>
                <p className="text-2xl text-green-900">#{currentUserRank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Points totaux</p>
              <p className="text-2xl text-green-900">{currentUserPoints}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Niveau</p>
              <p className="text-2xl text-green-900">{Math.floor(currentUserPoints / 100)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* 2nd Place */}
        <div className="md:order-1 order-2">
          <Card className="bg-gradient-to-br from-gray-100 to-gray-200">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <div className="bg-gray-400 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-white bg-gray-500">
                      {leaderboardData[1].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2">
                  <Medal className="w-8 h-8 text-gray-500 mx-auto" />
                </div>
              </div>
              <p className="text-gray-900">{leaderboardData[1].name}</p>
              <p className="text-sm text-gray-600">#{leaderboardData[1].rank}</p>
              <p className="text-gray-900 mt-2">{leaderboardData[1].points} pts</p>
              <Badge className="mt-2 bg-gray-500">Niveau {leaderboardData[1].level}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* 1st Place */}
        <div className="md:order-2 order-1">
          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 transform md:scale-110 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <div className="bg-yellow-400 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-white bg-yellow-500">
                      {leaderboardData[0].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2">
                  <Crown className="w-10 h-10 text-yellow-600 mx-auto" />
                </div>
              </div>
              <p className="text-yellow-900">{leaderboardData[0].name}</p>
              <p className="text-sm text-yellow-700">Champion 🏆</p>
              <p className="text-yellow-900 mt-2">{leaderboardData[0].points} pts</p>
              <Badge className="mt-2 bg-yellow-600">Niveau {leaderboardData[0].level}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* 3rd Place */}
        <div className="md:order-3 order-3">
          <Card className="bg-gradient-to-br from-orange-100 to-orange-200">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <div className="bg-orange-400 w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-white bg-orange-500">
                      {leaderboardData[2].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2">
                  <Medal className="w-8 h-8 text-orange-600 mx-auto" />
                </div>
              </div>
              <p className="text-orange-900">{leaderboardData[2].name}</p>
              <p className="text-sm text-orange-600">#{leaderboardData[2].rank}</p>
              <p className="text-orange-900 mt-2">{leaderboardData[2].points} pts</p>
              <Badge className="mt-2 bg-orange-600">Niveau {leaderboardData[2].level}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-900">Top 10 Mondial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                  user.rank <= 3 ? getRankColor(user.rank) + ' text-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 flex justify-center items-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar>
                    <AvatarFallback className={user.rank <= 3 ? 'bg-white/30' : 'bg-green-200'}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className={user.rank <= 3 ? 'text-white' : 'text-gray-900'}>
                      {user.name}
                    </p>
                    <p className={`text-sm ${user.rank <= 3 ? 'text-white/80' : 'text-gray-600'}`}>
                      {user.country} • Série de {user.streak} jours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={user.rank <= 3 ? 'text-white' : 'text-gray-900'}>
                      {user.points.toLocaleString()} pts
                    </p>
                    <p className={`text-sm ${user.rank <= 3 ? 'text-white/80' : 'text-gray-600'}`}>
                      Niveau {user.level}
                    </p>
                  </div>
                  <div className="text-2xl">{user.badge}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Info */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total missions complétées</p>
            <p className="text-2xl text-blue-900">8,432</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Participants actifs</p>
            <p className="text-2xl text-green-900">1,234</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Badges distribués</p>
            <p className="text-2xl text-purple-900">3,127</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
