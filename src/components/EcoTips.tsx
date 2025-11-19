import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Droplet, Zap, Recycle, ShoppingBag, Home, Leaf, Search, Heart } from 'lucide-react';

const tipsData = [
  {
    id: 1,
    title: 'Douches courtes',
    content: 'Limitez vos douches à 5 minutes maximum. Une douche de 5 minutes consomme environ 60 litres d\'eau contre 150 litres pour un bain.',
    category: 'Eau',
    icon: Droplet,
    impact: 'Économie de 90L d\'eau par douche',
    color: 'bg-blue-500',
    likes: 234,
  },
  {
    id: 2,
    title: 'Débrancher les appareils',
    content: 'Les appareils en veille consomment jusqu\'à 11% de votre facture électrique annuelle. Débranchez-les ou utilisez des multiprises à interrupteur.',
    category: 'Énergie',
    icon: Zap,
    impact: 'Jusqu\'à 80€/an d\'économie',
    color: 'bg-yellow-500',
    likes: 189,
  },
  {
    id: 3,
    title: 'Trier ses déchets',
    content: 'Le recyclage d\'une tonne de plastique permet d\'économiser 700 kg de pétrole brut. Vérifiez les consignes de tri de votre commune.',
    category: 'Déchets',
    icon: Recycle,
    impact: '700kg de pétrole économisés/tonne',
    color: 'bg-green-500',
    likes: 312,
  },
  {
    id: 4,
    title: 'Produits locaux et de saison',
    content: 'Acheter local et de saison réduit l\'empreinte carbone liée au transport et à la production sous serre.',
    category: 'Alimentation',
    icon: ShoppingBag,
    impact: '50% de CO₂ en moins',
    color: 'bg-purple-500',
    likes: 267,
  },
  {
    id: 5,
    title: 'Isolation thermique',
    content: 'Une bonne isolation peut réduire vos besoins de chauffage de 30%. Pensez aux doubles vitrages et à l\'isolation des combles.',
    category: 'Habitat',
    icon: Home,
    impact: '30% d\'énergie en moins',
    color: 'bg-orange-500',
    likes: 198,
  },
  {
    id: 6,
    title: 'Compostage domestique',
    content: 'Le compostage réduit de 30% le volume de vos déchets et produit un excellent engrais naturel pour vos plantes.',
    category: 'Déchets',
    icon: Leaf,
    impact: '30% de déchets en moins',
    color: 'bg-green-600',
    likes: 245,
  },
  {
    id: 7,
    title: 'Température du chauffage',
    content: 'Baisser votre chauffage de 1°C permet d\'économiser 7% d\'énergie. La température idéale est de 19°C dans les pièces à vivre.',
    category: 'Énergie',
    icon: Zap,
    impact: '7% d\'économie par degré',
    color: 'bg-yellow-500',
    likes: 156,
  },
  {
    id: 8,
    title: 'Récupération eau de pluie',
    content: 'Installez un récupérateur d\'eau de pluie pour arroser votre jardin. Vous pouvez économiser jusqu\'à 50% d\'eau.',
    category: 'Eau',
    icon: Droplet,
    impact: '50% d\'eau économisée',
    color: 'bg-blue-500',
    likes: 178,
  },
  {
    id: 9,
    title: 'Sac réutilisable',
    content: 'Utilisez des sacs réutilisables. Un sac plastique met 450 ans à se dégrader et pollue massivement les océans.',
    category: 'Déchets',
    icon: ShoppingBag,
    impact: 'Zéro déchet plastique',
    color: 'bg-green-500',
    likes: 289,
  },
  {
    id: 10,
    title: 'LED plutôt qu\'incandescentes',
    content: 'Les ampoules LED consomment 80% d\'énergie en moins et durent 25 fois plus longtemps que les ampoules incandescentes.',
    category: 'Énergie',
    icon: Zap,
    impact: '80% d\'énergie en moins',
    color: 'bg-yellow-500',
    likes: 201,
  },
  {
    id: 11,
    title: 'Réduire la viande',
    content: 'Manger moins de viande réduit considérablement votre empreinte carbone. Un jour végétarien par semaine fait la différence.',
    category: 'Alimentation',
    icon: Leaf,
    impact: '25% de CO₂ en moins',
    color: 'bg-purple-500',
    likes: 223,
  },
  {
    id: 12,
    title: 'Électroménager efficace',
    content: 'Choisissez des appareils A+++ qui consomment jusqu\'à 50% d\'énergie en moins que les appareils classiques.',
    category: 'Habitat',
    icon: Home,
    impact: '50% d\'économie d\'énergie',
    color: 'bg-orange-500',
    likes: 167,
  },
];

export function EcoTips() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedTips, setLikedTips] = useState<Set<number>>(new Set());

  const categories = ['all', 'Eau', 'Énergie', 'Déchets', 'Alimentation', 'Habitat'];

  const handleLike = (tipId: number) => {
    setLikedTips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tipId)) {
        newSet.delete(tipId);
      } else {
        newSet.add(tipId);
      }
      return newSet;
    });
  };

  const filteredTips = tipsData
    .filter(tip => {
      const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tip.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-green-900 mb-2">Astuces écologiques</h2>
        <p className="text-gray-600 mb-4">
          Découvrez des conseils pratiques pour réduire votre empreinte environnementale au quotidien
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une astuce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
              size="sm"
            >
              {category === 'all' ? 'Toutes les catégories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => {
          const Icon = tip.icon;
          const isLiked = likedTips.has(tip.id);

          return (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`${tip.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    {tip.category}
                  </Badge>
                </div>
                <CardTitle className="text-green-900">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {tip.content}
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Impact estimé</p>
                  <p className="text-sm text-green-900">{tip.impact}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{tip.likes + (isLiked ? 1 : 0)} personnes trouvent cela utile</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(tip.id)}
                    className={isLiked ? 'text-red-500' : 'text-gray-500'}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune astuce trouvée</p>
          <p className="text-sm text-gray-500 mt-1">Essayez avec d'autres mots-clés</p>
        </div>
      )}
    </div>
  );
}
