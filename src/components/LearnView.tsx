import { useState } from 'react';
import { Award, BookOpen, Clock, PlayCircle, Trophy, ArrowRight, X, Sparkles, CheckCircle2, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Article } from '../types';
import { articles, leaderboard, quizQuestions } from '../data';
import ImageWithLoader from './ImageWithLoader';

interface LearnViewProps {
  userPoints: number;
  onEarnPoints: (points: number) => void;
}

export default function LearnView({ userPoints, onEarnPoints }: LearnViewProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeArticleTab, setActiveArticleTab] = useState<'all' | 'compost'>('all');

  // Quiz game state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // index of current question
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const filteredArticles = activeArticleTab === 'all'
    ? articles
    : articles.filter(a => a.category === 'Compostage');

  // Quiz game mechanics
  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setQuizStep(0);
    setSelectedOptionIdx(null);
    setQuizScore(0);
    setHasSubmittedAnswer(false);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOptionIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || hasSubmittedAnswer) return;

    const currentQuestion = quizQuestions[quizStep];
    if (selectedOptionIdx === currentQuestion.correctIndex) {
      setQuizScore(prev => prev + 1);
    }
    setHasSubmittedAnswer(true);
  };

  const handleNextQuestion = () => {
    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(prev => prev + 1);
      setSelectedOptionIdx(null);
      setHasSubmittedAnswer(false);
    } else {
      setQuizFinished(true);
      // Credit points to user if they score well
      const pointsToEarn = quizScore >= 3 ? 50 : 15;
      onEarnPoints(pointsToEarn);
    }
  };

  const handleCloseQuiz = () => {
    setIsQuizActive(false);
  };

  // User rank computation
  const userRank = 142;
  const currentLevelLabel = 'Défenseur Vert';
  const nextLevelPoints = 2500;
  const progressPercent = Math.min(100, Math.floor((userPoints / nextLevelPoints) * 100));

  return (
    <div className="pb-24 px-4 pt-4 max-w-screen-xl mx-auto space-y-8 font-sans">
      {/* Daily Challenge: Ecology Quiz Banner */}
      <section>
        <AnimatePresence mode="wait">
          {!isQuizActive ? (
            <motion.div
              key="quiz-banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative overflow-hidden rounded-2xl bg-primary text-white p-6 shadow-lg group border border-emerald-700/30"
            >
              <div className="absolute -right-8 -top-8 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                    Défi Éco-Citoyen du Jour
                  </span>
                  <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                    Quiz Eco-Master
                  </h1>
                  <p className="text-xs text-emerald-100/95 leading-relaxed">
                    Testez vos connaissances sur l'écologie, le tri sélectif et l'économie circulaire pour remporter <strong className="text-primary-container font-extrabold">+50 Points Civiques</strong> aujourd'hui !
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleStartQuiz}
                      className="bg-white hover:bg-emerald-50 text-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Commencer le Quiz</span>
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex w-24 h-24 items-center justify-center bg-white/10 rounded-2xl border border-white/10 shrink-0">
                  <Award className="w-14 h-14 text-primary-container" />
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE INTERACTIVE QUIZ WINDOW */
            <motion.div
              key="quiz-active"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl relative border border-slate-800"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleCloseQuiz}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!quizFinished ? (
                <div className="space-y-6 text-xs max-w-2xl mx-auto py-2">
                  {/* Progress Header */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="font-bold text-primary-container tracking-wider uppercase text-2xs">
                      Question {quizStep + 1} sur {quizQuestions.length}
                    </span>
                    <span className="text-slate-400">Score : {quizScore} / {quizQuestions.length}</span>
                  </div>

                  {/* Question Title */}
                  <h3 className="font-display text-sm sm:text-base font-bold leading-normal text-slate-100">
                    {quizQuestions[quizStep].question}
                  </h3>

                  {/* Multiple Choices */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {quizQuestions[quizStep].options.map((option, idx) => {
                      const isSelected = selectedOptionIdx === idx;
                      const isCorrect = idx === quizQuestions[quizStep].correctIndex;

                      let btnStyle = 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800';
                      if (isSelected) btnStyle = 'border-primary-container bg-emerald-500/10 text-emerald-300';

                      if (hasSubmittedAnswer) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'border-red-500 bg-red-500/15 text-red-400';
                        } else {
                          btnStyle = 'border-slate-800 bg-slate-800/20 text-slate-500 pointer-events-none';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasSubmittedAnswer}
                          onClick={() => handleSelectOption(idx)}
                          className={`p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between gap-3 text-xs ${btnStyle}`}
                        >
                          <span className="flex-1">{option}</span>
                          {hasSubmittedAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {hasSubmittedAnswer && isSelected && !isCorrect && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {hasSubmittedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 space-y-1.5 leading-relaxed text-2xs"
                    >
                      <span className="font-bold text-slate-200 uppercase tracking-widest text-[9px] block">Explication :</span>
                      <p>{quizQuestions[quizStep].explanation}</p>
                    </motion.div>
                  )}

                  {/* Controls footer */}
                  <div className="flex justify-end pt-2 border-t border-slate-800">
                    {!hasSubmittedAnswer ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOptionIdx === null}
                        className="bg-primary-container hover:bg-emerald-500 disabled:opacity-50 text-slate-900 py-2.5 px-6 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Valider la réponse
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-white hover:bg-slate-100 text-slate-900 py-2.5 px-6 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{quizStep + 1 < quizQuestions.length ? 'Question suivante' : 'Terminer le Quiz'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* QUIZ FINISHED PANEL */
                <div className="space-y-5 text-center py-8 max-w-md mx-auto text-xs">
                  <div className="w-16 h-16 bg-emerald-500/15 text-primary-container rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-extrabold text-slate-100">Défi terminé !</h3>
                    <p className="text-slate-400">
                      Vous avez correctement répondu à <strong className="text-white font-semibold">{quizScore} sur {quizQuestions.length}</strong> questions.
                    </p>
                  </div>

                  {quizScore >= 3 ? (
                    <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 font-medium">
                      🏆 Félicitations ! Score suffisant ! Vous remportez <strong className="font-extrabold">+50 Points Civiques</strong> !
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400">
                      Vous y êtes presque ! Vous remportez tout de même <strong className="font-extrabold text-white">+15 Points Civiques</strong> pour votre participation.
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleStartQuiz}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Rejouer
                    </button>
                    <button
                      onClick={handleCloseQuiz}
                      className="px-5 py-2.5 bg-primary-container hover:bg-emerald-500 text-slate-900 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Retourner au Hub
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Grid: Articles feed left, Leaderboard right */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Knowledge Articles */}
        <div className="flex-grow lg:w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-slate-800">Fiches Pratiques & Guides</h2>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveArticleTab('all')}
                className={`px-3 py-1 rounded-md text-3xs font-bold uppercase transition-all ${
                  activeArticleTab === 'all' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setActiveArticleTab('compost')}
                className={`px-3 py-1 rounded-md text-3xs font-bold uppercase transition-all ${
                  activeArticleTab === 'compost' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Compostage
              </button>
            </div>
          </div>

          {/* Articles list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article, idx) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
              >
                {/* Image panel */}
                <div className="h-44 w-full relative overflow-hidden">
                  <ImageWithLoader
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <span className="absolute top-3 right-3 bg-primary/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {article.readTime}
                  </span>
                </div>

                {/* Info details */}
                <div className="p-4 flex flex-col flex-grow text-xs space-y-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="font-display text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-2xs leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>

                  <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-2xs">
                    <span className="text-slate-400 font-medium">Par {article.author}</span>
                    <span className="text-primary font-bold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      Lire la fiche <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar: Leaderboard and Stats */}
        <aside className="lg:w-1/3 shrink-0 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Contributeurs de la Semaine
            </h3>

            {/* Competitors List */}
            <div className="space-y-2 text-xs">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-2xs hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
                      user.rank === 1 ? 'bg-amber-100 text-amber-800' :
                      user.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.rank}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-700">{user.name}</p>
                      <p className="text-slate-400 text-3xs font-semibold">{user.points} Points Civiques</p>
                    </div>
                  </div>
                  <span className="text-slate-400 font-bold">🌟</span>
                </div>
              ))}
            </div>

            {/* Personal Tracker Card */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary tracking-wider uppercase text-2xs">Votre Classement</span>
                <span className="font-display text-sm font-extrabold text-primary">#{userRank}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-2xs font-semibold text-slate-600">
                  <span>Score Éco Citoyen</span>
                  <span>{userPoints} pts / {nextLevelPoints} pts</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
              <p className="text-3xs text-slate-400 font-medium italic">
                Encore {nextLevelPoints - userPoints} points pour débloquer le Niveau 4 ({currentLevelLabel}) !
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Article Detail Overlaid Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100 text-xs"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Fiche Pratique : {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Cover */}
              <div className="space-y-4">
                <h2 className="font-display text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="rounded-xl overflow-hidden h-60 bg-slate-100">
                  <ImageWithLoader
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-2xs text-slate-400">
                  <span>Auteur : <strong>{selectedArticle.author}</strong></span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Lecture : {selectedArticle.readTime}
                  </span>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Content text parse */}
                <div className="text-slate-600 leading-relaxed space-y-3 font-sans max-w-none text-xs">
                  {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('###')) {
                      return (
                        <h4 key={pIdx} className="font-display font-bold text-xs text-slate-800 pt-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {paragraph.replace('###', '').trim()}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <ul key={pIdx} className="list-disc list-inside space-y-1 pl-2">
                          {paragraph.split('\n').map((li, lIdx) => (
                            <li key={lIdx} className="text-slate-600">
                              {li.replace('-', '').trim()}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.startsWith('1.')) {
                      return (
                        <ol key={pIdx} className="list-decimal list-inside space-y-1 pl-2">
                          {paragraph.split('\n').map((li, lIdx) => (
                            <li key={lIdx} className="text-slate-600">
                              {li.replace(/^\d+\.\s*/, '').trim()}
                            </li>
                          ))}
                        </ol>
                      );
                    }
                    return <p key={pIdx}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
