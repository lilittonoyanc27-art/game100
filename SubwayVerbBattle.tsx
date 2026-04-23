import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  User, 
  Trophy, 
  Music, 
  Dribbble, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  TrainFront
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Question {
  id: number;
  sentence: string;
  translation: string;
  options: string[];
  correct: string;
  explanation: string;
}

// --- Data: 20 Questions (Jugar vs Tocar) ---

const QUESTIONS: Question[] = [
  { id: 1, sentence: "Yo ____ el piano.", translation: "Ես դաշնամուր եմ նվագում:", options: ["juego", "toco"], correct: "toco", explanation: "Երաժշտական գործիք նվագելը 'tocar' է:" },
  { id: 2, sentence: "Tú ____ al fútbol.", translation: "Դու ֆուտբոլ ես խաղում:", options: ["juegas", "tocas"], correct: "juegas", explanation: "Սպորտային խաղերը 'jugar' են:" },
  { id: 3, sentence: "Él ____ la guitarra.", translation: "Նա կիթառ է նվագում:", options: ["juega", "toca"], correct: "toca", explanation: "Կիթառ նվագելը 'tocar' է:" },
  { id: 4, sentence: "Nosotros ____ al tenis.", translation: "Մենք թենիս ենք խաղում:", options: ["jugamos", "tocamos"], correct: "jugamos", explanation: "Թենիս խաղալը 'jugar' է:" },
  { id: 5, sentence: "Ellos ____ la batería.", translation: "Նրանք հարվածային գործիքներ են նվագում:", options: ["juegan", "tocan"], correct: "tocan", explanation: "Հարվածային գործիքներ նվագելը 'tocar' է:" },
  { id: 6, sentence: "Yo ____ al ajedrez.", translation: "Ես շախմատ եմ խաղում:", options: ["juego", "toco"], correct: "juego", explanation: "Շախմատը 'jugar' է:" },
  { id: 7, sentence: "¿____ tú el violín?", translation: "Դու ջութակ նվագո՞ւմ ես:", options: ["Juegas", "Tocas"], correct: "Tocas", explanation: "Ջութակ նվագելը 'tocar' է:" },
  { id: 8, sentence: "Ella ____ videojuegos.", translation: "Նա վիդեոխաղեր է խաղում:", options: ["juega", "toca"], correct: "juega", explanation: "Վիդեոխաղերը 'jugar' են:" },
  { id: 9, sentence: "Nosotros ____ el arpa.", translation: "Մենք տավիղ ենք նվագում:", options: ["jugamos", "tocamos"], correct: "tocamos", explanation: "Տավիղ նվագելը 'tocar' է:" },
  { id: 10, sentence: "Ustedes ____ al béisbol.", translation: "Դուք բեյսբոլ եք խաղում:", options: ["juegan", "tocan"], correct: "juegan", explanation: "Բեյսբոլը 'jugar' է:" },
  { id: 11, sentence: "Yo ____ la flauta.", translation: "Ես ֆլեյտա եմ նվագում:", options: ["juego", "toco"], correct: "toco", explanation: "Ֆլեյտա նվագելը 'tocar' է:" },
  { id: 12, sentence: "Tú ____ al básquet.", translation: "Դու բասկետբոլ ես խաղում:", options: ["juegas", "tocas"], correct: "juegas", explanation: "Բասկետբոլը 'jugar' է:" },
  { id: 13, sentence: "Él ____ el saxofón.", translation: "Նա սաքսոֆոն է նվագում:", options: ["juega", "toca"], correct: "toca", explanation: "Սաքսոֆոնը 'tocar' է:" },
  { id: 14, sentence: "Ellos ____ al póker.", translation: "Նրանք պոկեր են խաղում:", options: ["juegan", "tocan"], correct: "juegan", explanation: "Պոկերը 'jugar' է:" },
  { id: 15, sentence: "Yo ____ la trompeta.", translation: "Ես շեփոր եմ նվագում:", options: ["juego", "toco"], correct: "toco", explanation: "Շեփոր նվագելը 'tocar' է:" },
  { id: 16, sentence: "Nosotros ____ al golf.", translation: "Մենք գոլֆ ենք խաղում:", options: ["jugamos", "tocamos"], correct: "jugamos", explanation: "Գոլֆը 'jugar' է:" },
  { id: 17, sentence: "¿____ ellos el bajo?", translation: "Նրանք բաս-կիթառ նվագո՞ւմ են:", options: ["Juegan", "Tocan"], correct: "Tocan", explanation: "Բաս-կիթառ նվագելը 'tocar' է:" },
  { id: 18, sentence: "Ella ____ a las cartas.", translation: "Նա թղթախաղ է խաղում:", options: ["juega", "toca"], correct: "juega", explanation: "Թղթախաղը 'jugar' է:" },
  { id: 19, sentence: "Yo ____ el violoncheլո.", translation: "Ես թավջութակ եմ նվագում:", options: ["juego", "toco"], correct: "toco", explanation: "Թավջութակ նվագելը 'tocar' է:" },
  { id: 20, sentence: "Ustedes ____ al vóley.", translation: "Դուք վոլեյբոլ եք խաղում:", options: ["juegan", "tocan"], correct: "juegan", explanation: "Վոլեյբոլը 'jugar' է:" }
];

// --- 3D Subway Component ---

const SubwayTrack = ({ children, speed = 1 }: { children: React.ReactNode, speed?: number }) => {
  return (
    <div className="relative w-full h-[400px] bg-stone-900 rounded-[50px] overflow-hidden border-4 border-stone-800 shadow-inner perspective-1000">
      {/* 3D Track */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-800 to-black transform-gpu rotateX-45 origin-bottom">
         {/* Animated Lines */}
         <motion.div 
           animate={{ y: [0, 100] }} 
           transition={{ duration: 1 / speed, repeat: Infinity, ease: "linear" }}
           className="w-full h-[600px] absolute top-[-200px] flex flex-col items-center justify-around opacity-20"
         >
           {[...Array(8)].map((_, i) => (
             <div key={i} className="w-full h-1 bg-stone-500" />
           ))}
         </motion.div>
         
         {/* Perspective Rails */}
         <div className="absolute top-0 left-1/4 w-1 h-full bg-yellow-500/20 blur-[1px]" />
         <div className="absolute top-0 right-1/4 w-1 h-full bg-yellow-500/20 blur-[1px]" />
      </div>

      {children}
    </div>
  );
};

// --- Subway Character Component ---

const SubwayPlayer = ({ name, color, isActive, isAnimating, feedback }: { 
  name: string; 
  color: string; 
  isActive: boolean; 
  isAnimating: boolean;
  feedback: { correct: boolean } | null;
}) => {
  return (
    <motion.div 
      animate={isActive && isAnimating ? { 
        x: feedback?.correct ? [0, -20, 20, 0] : [0, 5, -5, 5, -5, 0],
        y: feedback?.correct ? [0, -100, 0] : 0,
        scale: feedback?.correct ? [1, 1.1, 1] : 1
      } : {
        y: [0, -5, 0], // Continuous running bounce
      }}
      transition={isActive && isAnimating ? { duration: 0.5 } : { repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      className={`relative p-4 md:p-6 rounded-[25px] md:rounded-[30px] shadow-2xl z-20 transition-all duration-500 ${
        color
      } ${isActive ? 'scale-110 border-4 border-white' : 'scale-90 opacity-60'}`}
    >
       <User size={40} className="text-white md:hidden" />
       <User size={60} className="text-white hidden md:block" />
       
       <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{name}</span>
       </div>

       {isActive && feedback?.correct && (
         <motion.div 
           animate={{ rotate: 360, scale: [1, 1.5, 1] }} 
           transition={{ repeat: Infinity, duration: 2 }} 
           className="absolute -top-4 -right-4 bg-yellow-500 p-1.5 rounded-full"
         >
           <Sparkles size={14} className="text-white" />
         </motion.div>
       )}
    </motion.div>
  );
};

export default function SubwayVerbBattle() {
  const [view, setView] = useState<'intro' | 'play' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ Gor: 0, Gayane: 0 });
  const [turn, setTurn] = useState<'Gor' | 'Gayane'>('Gor');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [animatingPlayer, setAnimatingPlayer] = useState(false);

  const startBattle = () => {
    setView('play');
    setCurrentIdx(0);
    setScores({ Gor: 0, Gayane: 0 });
    setTurn('Gor');
    setFeedback(null);
  };

  const handleAnswer = (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === QUESTIONS[currentIdx].correct;
    if (isCorrect) {
      setScores(s => ({ ...s, [turn]: s[turn] + 1 }));
    }
    setFeedback({ correct: isCorrect, msg: QUESTIONS[currentIdx].explanation });
    setAnimatingPlayer(true);
    
    // Auto proceed after delay
    setTimeout(() => {
      setAnimatingPlayer(false);
    }, 1000);
  };

  const nextTurn = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTurn(turn === 'Gor' ? 'Gayane' : 'Gor');
      setFeedback(null);
    } else {
      setView('result');
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-indigo-50 font-sans p-4 md:p-6 overflow-hidden flex flex-col items-center justify-center relative">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[10%] left-[5%] rotate-12"><TrainFront size={400} /></div>
        <div className="absolute bottom-[10%] right-[5%] -rotate-12"><Zap size={400} /></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* INTRO VIEW */}
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1 }}
            className="z-10 text-center max-w-lg space-y-8 md:space-y-12"
          >
            <div className="space-y-6">
               <div className="flex justify-center gap-6">
                  <motion.div 
                    animate={{ rotate: [-5, 5, -5] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-orange-600 rounded-[32px] flex flex-col items-center justify-center border-4 border-orange-400 shadow-[0_0_40px_rgba(234,88,12,0.4)]"
                  >
                    <User size={36} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Gor</span>
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: [5, -5, 5] }} 
                    transition={{ repeat: Infinity, duration: 2.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-[32px] flex flex-col items-center justify-center border-4 border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                  >
                    <User size={36} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Gayane</span>
                  </motion.div>
               </div>
               <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
                 Subway <span className="text-indigo-500">Battle</span>
               </h1>
               <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 text-stone-400 font-black uppercase text-[10px] md:text-xs tracking-widest">
                 <Dribbble size={14} className="text-orange-500" /> JUGAR <span className="text-stone-700">|</span> <Music size={14} className="text-blue-500" /> TOCAR
               </div>
               <p className="text-stone-500 italic max-w-xs mx-auto text-xs md:text-sm">
                 Գոռը և Գայանեն մրցում են Subway ոճով: Ընտրե՛ք ճիշտ ճանապարհը:
               </p>
            </div>

            <button 
              onClick={startBattle}
              className="group relative w-full py-6 md:py-8 bg-indigo-600 rounded-[40px] md:rounded-[50px] font-black text-2xl md:text-4xl uppercase italic tracking-tighter shadow-3xl hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-4 border-b-[8px] md:border-b-[10px] border-indigo-900"
            >
              Start Battle <Zap size={32} className="animate-pulse md:block" />
            </button>
          </motion.div>
        )}

        {/* PLAY VIEW */}
        {view === 'play' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full max-w-4xl space-y-6 md:space-y-8"
          >
            {/* SCOREBOARD */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
               <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all ${turn === 'Gor' ? 'bg-orange-600 border-white shadow-xl' : 'bg-stone-900 border-stone-800 opacity-50'}`}>
                  <div className="flex justify-between items-center gap-3 md:gap-4">
                     <span className="font-black italic uppercase text-[10px]">Gor</span>
                     <span className="text-xl md:text-2xl font-black">{scores.Gor}</span>
                  </div>
               </div>
               <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all ${turn === 'Gayane' ? 'bg-blue-600 border-white shadow-xl' : 'bg-stone-900 border-stone-800 opacity-50'}`}>
                  <div className="flex justify-between items-center gap-3 md:gap-4">
                     <span className="font-black italic uppercase text-[10px]">Gayane</span>
                     <span className="text-xl md:text-2xl font-black">{scores.Gayane}</span>
                  </div>
               </div>
            </div>

            {/* 3D SUBWAY TRACK */}
            <div className="relative">
               <SubwayTrack speed={feedback ? 0 : 1}>
                  {/* Both Players Running */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 items-end">
                    <SubwayPlayer 
                      name="Gor" 
                      color="bg-orange-600" 
                      isActive={turn === 'Gor'} 
                      isAnimating={animatingPlayer} 
                      feedback={feedback}
                    />
                    <SubwayPlayer 
                      name="Gayane" 
                      color="bg-blue-600" 
                      isActive={turn === 'Gayane'} 
                      isAnimating={animatingPlayer} 
                      feedback={feedback}
                    />
                  </div>

                  {/* Obstacles (Options) */}
                  <AnimatePresence>
                    {!feedback && (
                      <motion.div 
                        initial={{ z: -1000, scale: 0.1, opacity: 0 }}
                        animate={{ z: 0, scale: 1, opacity: 1 }}
                        exit={{ z: 500, scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-10 md:gap-20 px-8 md:px-20"
                      >
                         {QUESTIONS[currentIdx].options.map((opt, i) => (
                           <motion.button
                             key={opt}
                             whileHover={{ scale: 1.1, y: -20 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => handleAnswer(opt)}
                             className={`relative w-32 md:w-48 h-20 md:h-32 rounded-[25px] md:rounded-[40px] flex items-center justify-center font-black text-3xl md:text-5xl uppercase tracking-tighter italic border-4 md:border-[6px] shadow-2xl transition-all ${
                               i === 0 ? 'bg-indigo-600 border-indigo-400' : 'bg-purple-600 border-purple-400'
                             }`}
                           >
                             <span className="text-white">{opt}</span>
                             <div className="absolute -top-4 -left-4 bg-white text-black text-[8px] md:text-xs px-2 py-0.5 rounded-full">Path {i+1}</div>
                           </motion.button>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Result HUD */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-10 text-center z-30"
                      >
                         <div className="space-y-4">
                            {feedback.correct ? <CheckCircle2 size={60} className="text-emerald-500 mx-auto md:w-[100px] md:h-[100px]" /> : <XCircle size={60} className="text-rose-500 mx-auto md:w-[100px] md:h-[100px]" />}
                            <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">{feedback.correct ? "Victory Jump!" : "Collision!"}</h3>
                            <p className="text-stone-400 font-bold max-w-sm md:max-w-md mx-auto text-sm md:text-base">{feedback.msg}</p>
                         </div>
                         <button 
                           onClick={nextTurn}
                           className="mt-8 md:mt-12 px-8 md:px-12 py-3 md:py-5 bg-white text-black rounded-full font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-3 hover:scale-110 active:scale-95 transition-all shadow-2xl"
                         >
                           Continue Run <ArrowRight size={20} />
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </SubwayTrack>
            </div>

            {/* QUESTION CARD */}
            <div className="bg-stone-900 border-4 border-stone-800 p-6 md:p-10 rounded-[40px] md:rounded-[60px] text-center space-y-4 md:space-y-6 shadow-4xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5"><Zap size={100} /></div>
               <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-4 py-1 rounded-full text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  Level {currentIdx + 1}
               </div>
               <h2 className="text-2xl md:text-5xl font-black italic tracking-tighter text-white leading-tight">
                 {QUESTIONS[currentIdx].sentence.split('____').map((part, i) => (
                   <span key={i}>
                     {part}
                     {i === 0 && <span className="text-indigo-500 underline decoration-4 md:decoration-8 underline-offset-[8px] md:underline-offset-[12px]">____</span>}
                   </span>
                 ))}
               </h2>
               <p className="text-indigo-300 font-bold italic text-sm md:text-xl opacity-80">
                 {QUESTIONS[currentIdx].translation}
               </p>
            </div>
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: 0 }}
            className="z-10 text-center space-y-8 max-w-lg w-full"
          >
            <Trophy size={160} className="mx-auto text-yellow-500 drop-shadow-[0_0_60px_rgba(234,179,8,0.5)] animate-bounce" />
            
            <div className="bg-white/5 border border-white/10 p-10 rounded-[60px] space-y-6 backdrop-blur-2xl shadow-4xl">
               <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-none">Run Over</h2>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-orange-600 p-8 rounded-[40px] border-b-8 border-orange-900 shadow-xl">
                     <p className="font-black italic uppercase text-xs mb-2">Gor Score</p>
                     <p className="text-7xl font-black">{scores.Gor}</p>
                  </div>
                  <div className="bg-blue-600 p-8 rounded-[40px] border-b-8 border-blue-900 shadow-xl">
                     <p className="font-black italic uppercase text-xs mb-2">Gayane Score</p>
                     <p className="text-7xl font-black">{scores.Gayane}</p>
                  </div>
               </div>

               <div className="p-6 bg-indigo-500/20 rounded-[30px] border border-indigo-500/30">
                  <p className="text-2xl font-black italic text-indigo-400">
                    {scores.Gor > scores.Gayane ? "🎸 Գոռը անառիկ էր! Հաղթանակ:" : 
                     scores.Gayane > scores.Gor ? "🎹 Գայանեն ռեկորդ սահմանեց! Հաղթանակ:" : 
                     "🛹 Սա լավագույն դուետն էր: Ոչ-ոքի:"}
                  </p>
               </div>
            </div>

            <button 
              onClick={() => setView('intro')}
              className="w-full py-9 bg-white text-black rounded-[50px] font-black text-4xl uppercase italic tracking-tighter shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              Restart Run <RotateCcw size={40} />
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <footer className="fixed bottom-12 opacity-5 pointer-events-none">
         <p className="text-[10px] font-black uppercase tracking-[2.5em] text-white italic">Subway Verb Battle: Gor vs Gayane</p>
      </footer>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotateX-45 { transform: rotateX(45deg); }
      `}</style>
    </div>
  );
}
