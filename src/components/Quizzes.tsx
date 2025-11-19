// ============================================================================
// Quizzes.tsx - Composant Système de Quiz
// ============================================================================
// Ce composant gère tout le système de quiz écologiques:
// - Affichage de la liste des quiz disponibles
// - Déroulement d'un quiz (questions, réponses, validation)
// - Calcul du score et affichage des résultats
// - Attribution des points et CO₂ si réussi (≥66%)
// ============================================================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, XCircle, Award, Leaf } from 'lucide-react';
import { toast } from 'sonner';

// ========== INTERFACE DES PROPS ==========
// Fonction callback pour informer le parent (App.tsx) quand un quiz est terminé
interface QuizzesProps {
  onComplete: (points: number, co2: number) => void;  // Appelée si quiz réussi
}

// ========== DONNÉES DES QUIZ ==========
// Base de données locale des quiz (à remplacer par des appels API)
const quizData = [
  {
    id: 1,
    title: 'Les bases du recyclage',
    description: 'Testez vos connaissances sur le tri des déchets',
    difficulty: 'Facile',
    points: 50,           // Points gagnés si réussi
    co2Impact: 5,         // CO₂ réduit si réussi
    questions: [
      {
        question: 'Quelle poubelle pour les bouteilles en plastique ?',
        options: ['Poubelle jaune', 'Poubelle verte', 'Poubelle noire'],
        correct: 0,       // Index de la bonne réponse (0 = première option)
      },
      {
        question: 'Les piles usagées doivent être :',
        options: ['Jetées à la poubelle', 'Rapportées en magasin', 'Enterrées'],
        correct: 1,
      },
      {
        question: 'Combien de temps pour qu\'une bouteille plastique se décompose ?',
        options: ['10 ans', '100 ans', '450 ans'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'Économie d\'énergie',
    description: 'Découvrez comment réduire votre consommation',
    difficulty: 'Moyen',
    points: 75,
    co2Impact: 10,
    questions: [
      {
        question: 'Quelle température idéale pour le chauffage en hiver ?',
        options: ['18-19°C', '21-22°C', '23-24°C'],
        correct: 0,
      },
      {
        question: 'Éteindre un appareil en veille permet d\'économiser jusqu\'à :',
        options: ['5% d\'énergie', '11% d\'énergie', '20% d\'énergie'],
        correct: 1,
      },
      {
        question: 'L\'ampoule LED consomme par rapport à une incandescente :',
        options: ['30% de moins', '50% de moins', '80% de moins'],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    title: 'Alimentation durable',
    description: 'L\'impact de nos choix alimentaires',
    difficulty: 'Moyen',
    points: 75,
    co2Impact: 15,
    questions: [
      {
        question: 'Quel aliment a la plus forte empreinte carbone ?',
        options: ['Bœuf', 'Poulet', 'Tofu'],
        correct: 0,
      },
      {
        question: 'Les fruits de saison c\'est :',
        options: ['Plus cher', 'Moins écologique', 'Moins de CO₂'],
        correct: 2,
      },
      {
        question: 'Réduire le gaspillage alimentaire permet d\'économiser :',
        options: ['5% de CO₂', '8% de CO₂', '10% de CO₂'],
        correct: 2,
      },
    ],
  },
];

export function Quizzes({ onComplete }: QuizzesProps) {
  
  // ========== ÉTAT DU COMPOSANT ==========
  
  // ID du quiz actuellement sélectionné (null = aucun quiz actif)
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  
  // Index de la question actuelle (0, 1, 2...)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Index de la réponse sélectionnée par l'utilisateur (null = pas encore répondu)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  // Afficher l'écran de résultats final?
  const [showResult, setShowResult] = useState(false);
  
  // Nombre de bonnes réponses
  const [score, setScore] = useState(0);
  
  // Tableau des résultats (true = correct, false = incorrect)
  const [answers, setAnswers] = useState<boolean[]>([]);

  // ========== FONCTION: DÉMARRER UN QUIZ ==========
  /**
   * Initialise un nouveau quiz
   * Réinitialise tous les états à leurs valeurs par défaut
   */
  const handleQuizStart = (quizId: number) => {
    setSelectedQuiz(quizId);      // Sélectionne le quiz
    setCurrentQuestion(0);         // Commence à la première question
    setSelectedAnswer(null);       // Aucune réponse sélectionnée
    setShowResult(false);          // Cache l'écran de résultats
    setScore(0);                   // Score à zéro
    setAnswers([]);                // Tableau de réponses vide
  };

  // ========== FONCTION: SOUMETTRE UNE RÉPONSE ==========
  /**
   * Valide la réponse de l'utilisateur et passe à la question suivante
   * Ou affiche les résultats si c'était la dernière question
   */
  const handleAnswerSubmit = () => {
    // Vérifier qu'une réponse a été sélectionnée
    if (selectedAnswer === null) return;

    // Récupérer le quiz actuel
    const quiz = quizData.find(q => q.id === selectedQuiz);
    if (!quiz) return;

    // Vérifier si la réponse est correcte
    const isCorrect = selectedAnswer === quiz.questions[currentQuestion].correct;
    
    // Ajouter le résultat au tableau des réponses
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    // Incrémenter le score si correct
    if (isCorrect) {
      setScore(score + 1);
    }

    // Passer à la question suivante ou afficher les résultats
    if (currentQuestion < quiz.questions.length - 1) {
      // Il reste des questions: passer à la suivante après 1 seconde
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);  // Réinitialiser la sélection
      }, 1000);
    } else {
      // C'était la dernière question: afficher les résultats après 1 seconde
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }
  };

  // ========== FONCTION: TERMINER LE QUIZ ==========
  /**
   * Gère la fin du quiz:
   * - Calcule le pourcentage de réussite
   * - Attribue les points si ≥66%
   * - Affiche une notification
   * - Retourne à la liste des quiz
   */
  const handleQuizComplete = () => {
    const quiz = quizData.find(q => q.id === selectedQuiz);
    if (!quiz) return;

    // Calculer le pourcentage de bonnes réponses
    const percentage = (score / quiz.questions.length) * 100;
    
    // Quiz réussi si ≥66% (2/3 des questions)
    if (percentage >= 66) {
      // Informer le parent (App.tsx) pour mettre à jour les points et CO₂
      onComplete(quiz.points, quiz.co2Impact);
      
      // Afficher une notification de succès
      toast.success(`Quiz réussi ! +${quiz.points} points et -${quiz.co2Impact}kg CO₂`, {
        description: 'Votre contribution a été ajoutée au compteur collectif',
      });
    } else {
      // Afficher une notification d'échec
      toast.error('Quiz échoué. Réessayez pour gagner des points !');
    }

    // Réinitialiser tous les états pour retourner à la liste
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  // ========== RENDU: ÉCRAN DE RÉSULTATS ==========
  // Si un quiz est sélectionné ET qu'on doit afficher les résultats
  if (selectedQuiz !== null) {
    const quiz = quizData.find(q => q.id === selectedQuiz);
    if (!quiz) return null;

    if (showResult) {
      // Calculer le pourcentage et déterminer si réussi
      const percentage = (score / quiz.questions.length) * 100;
      const passed = percentage >= 66;

      return (
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              {/* Icône de succès ou échec */}
              <div className="flex justify-center mb-4">
                {passed ? (
                  <div className="bg-green-100 p-4 rounded-full">
                    <Award className="w-12 h-12 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-red-100 p-4 rounded-full">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                )}
              </div>
              
              {/* Titre et score */}
              <CardTitle className={passed ? 'text-green-900' : 'text-red-900'}>
                {passed ? 'Quiz réussi !' : 'Quiz échoué'}
              </CardTitle>
              <CardDescription>
                Vous avez obtenu {score} / {quiz.questions.length} bonnes réponses
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Pourcentage et barre de progression */}
              <div className="text-center">
                <div className="text-4xl mb-2">{percentage.toFixed(0)}%</div>
                <Progress value={percentage} className="h-2" />
              </div>

              {/* Récompenses (si réussi) */}
              {passed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 mb-2">Récompenses obtenues :</p>
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">+{quiz.points} points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <span className="text-green-900">-{quiz.co2Impact}kg CO₂</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Détail des réponses */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Détail des réponses :</p>
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {/* Icône verte si correct, rouge si incorrect */}
                    {answers[idx] ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={answers[idx] ? 'text-green-700' : 'text-red-700'}>
                      Question {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton pour retourner à la liste */}
              <Button onClick={handleQuizComplete} className="w-full bg-green-600 hover:bg-green-700">
                Retour aux quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // ========== RENDU: QUESTION ACTUELLE ==========
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200">
          <CardHeader>
            {/* En-tête avec titre et numéro de question */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-green-900">{quiz.title}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} / {quiz.questions.length}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700">{quiz.difficulty}</Badge>
            </div>
            {/* Barre de progression du quiz */}
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              {/* Question */}
              <h3 className="text-green-900 mb-4">{question.question}</h3>
              
              {/* Options de réponse */}
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    disabled={selectedAnswer !== null}  // Désactiver après sélection
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === null
                        ? 'border-gray-200 hover:border-green-300 hover:bg-green-50'  // Avant sélection
                        : selectedAnswer === idx
                        ? idx === question.correct
                          ? 'border-green-500 bg-green-50'  // Réponse correcte sélectionnée
                          : 'border-red-500 bg-red-50'      // Réponse incorrecte sélectionnée
                        : idx === question.correct
                        ? 'border-green-500 bg-green-50'    // Montrer la bonne réponse
                        : 'border-gray-200 opacity-50'      // Autres options
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {/* Icônes de validation */}
                      {selectedAnswer !== null && idx === question.correct && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {selectedAnswer === idx && idx !== question.correct && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton pour passer à la question suivante */}
            <Button
              onClick={handleAnswerSubmit}
              disabled={selectedAnswer === null}  // Désactivé tant qu'aucune réponse n'est sélectionnée
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {currentQuestion < quiz.questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== RENDU: LISTE DES QUIZ ==========
  // Affichage par défaut: grille de tous les quiz disponibles
  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-green-900 mb-2">Quiz écologiques</h2>
        <p className="text-gray-600">
          Testez vos connaissances et gagnez des points verts. Réussissez 2/3 des questions pour valider !
        </p>
      </div>

      {/* Grille des quiz */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-green-900">{quiz.title}</CardTitle>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  {quiz.difficulty}
                </Badge>
              </div>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Récompenses */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{quiz.points} points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">-{quiz.co2Impact}kg CO₂</span>
                </div>
              </div>
              
              {/* Nombre de questions */}
              <div className="text-sm text-gray-600">
                {quiz.questions.length} questions
              </div>
              
              {/* Bouton pour démarrer */}
              <Button
                onClick={() => handleQuizStart(quiz.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
