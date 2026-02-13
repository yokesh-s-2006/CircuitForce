import React, { useState, useRef } from 'react';
import { Sparkles, Send, Loader2, Heart, Mic, MessageSquare, AlertCircle } from 'lucide-react';
import { getFloraVoiceResponse } from '../services/geminiservice.ts';
import { Mood } from '../types.ts';
import PlantVisual from './plantvisual.tsx';

interface SoulSessionProps {
  onInsightUpdate: (text: string) => void;
}

const SoulSession: React.FC<SoulSessionProps> = ({ onInsightUpdate }) => {
  const [thought, setThought] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interactionType, setInteractionType] = useState<'text' | 'voice'>('text');
  const [error, setError] = useState<string | null>(null);
  
  const handleTextSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim() || isThinking) return;

    setError(null);
    setIsThinking(true);
    try {
      const { text } = await getFloraVoiceResponse(thought);
      onInsightUpdate(text);
      setThought('');
    } catch (error: any) {
      console.error("Text Support Error:", error);
      setError("I'm momentarily quiet. Let's try again in a moment. 🌿");
    } finally {
      setIsThinking(false);
    }
  };

  const startVoiceMemo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = async () => {
          setIsThinking(true);
          try {
            const { text } = await getFloraVoiceResponse(`[Voice memo transcription would go here]`);
            onInsightUpdate(text);
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
          } catch (err) {
            setError("Could not process voice memo.");
          } finally {
            setIsThinking(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      setIsSpeaking(true);
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        setIsSpeaking(false);
      }, 10000);
    } catch (err: any) {
      setError("I can't hear you! Please check your microphone permissions.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-700 max-w-4xl mx-auto py-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-amber-100 to-emerald-100 text-emerald-800 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm">
          <Sparkles size={16} className="text-amber-500" />
          <span>Soul Support Hub</span>
          <Sparkles size={16} className="text-amber-500" />
        </div>
        <h2 className="text-6xl font-black text-stone-900 tracking-tight">Soul Session</h2>
        <p className="text-stone-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
          Flora is here for you. Share anything, and she will speak belief back into your heart. 🌿✨
        </p>
      </div>

      {error && (
        <div className="w-full max-w-md p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl flex items-center gap-3 animate-bounce">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="relative">
        <div className={`transition-all duration-1000 transform ${isSpeaking ? 'scale-110 rotate-1' : 'scale-100'}`}>
          <PlantVisual mood={isSpeaking ? Mood.HAPPY : Mood.CALM} color="bg-emerald-50 text-emerald-600 border-emerald-200" />
        </div>
        
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[450px] h-[450px] bg-emerald-400/10 rounded-full animate-ping"></div>
            <div className="w-[350px] h-[350px] bg-emerald-400/20 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col items-center space-y-8">
        <div className="flex bg-stone-100/80 p-1.5 rounded-[2rem] shadow-inner backdrop-blur-md">
          <button 
            onClick={() => { setInteractionType('text'); setError(null); }}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.8rem] font-black transition-all ${interactionType === 'text' ? 'bg-white shadow-xl text-emerald-600 scale-105' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <MessageSquare size={20} />
            Text Message
          </button>
          <button 
            onClick={() => { setInteractionType('voice'); setError(null); }}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.8rem] font-black transition-all ${interactionType === 'voice' ? 'bg-white shadow-xl text-emerald-600 scale-105' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Mic size={20} />
            Voice Memo
          </button>
        </div>

        {interactionType === 'text' ? (
          <form onSubmit={handleTextSupport} className="w-full max-w-xl relative group">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Share what's on your heart... Flora will respond with warmth and belief."
              className="w-full p-10 pr-24 bg-white border-4 border-emerald-50 rounded-[3rem] shadow-2xl focus:border-emerald-200 focus:ring-[1.5rem] focus:ring-emerald-50 outline-none transition-all resize-none h-52 text-xl text-stone-700 placeholder:text-stone-300 font-medium leading-relaxed"
            />
            <button
              type="submit"
              disabled={isThinking || !thought.trim()}
              className="absolute bottom-8 right-8 p-6 bg-emerald-600 text-white rounded-[2rem] shadow-xl hover:bg-emerald-700 hover:scale-110 active:scale-95 disabled:bg-stone-200 transition-all flex items-center justify-center"
            >
              {isThinking ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} />}
            </button>
          </form>
        ) : (
          <div className="w-full max-w-lg">
            <button 
              onClick={startVoiceMemo}
              disabled={isThinking}
              className="w-full py-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(5,150,105,0.4)] hover:shadow-[0_30px_70px_-15px_rgba(5,150,105,0.5)] hover:scale-[1.02] active:scale-95 disabled:bg-stone-400 transition-all flex flex-col items-center justify-center gap-6 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 bg-white/20 rounded-[2.5rem] backdrop-blur-xl group-hover:rotate-12 transition-transform shadow-inner">
                <Mic size={48} className={isThinking ? 'animate-spin' : 'animate-pulse'} />
              </div>
              <div className="text-center">
                <span className="text-3xl font-black block tracking-tight uppercase">{isThinking ? 'Processing...' : 'Record Voice Memo'}</span>
                <span className="text-emerald-100/80 font-bold uppercase tracking-widest text-sm mt-1 italic">Up to 10 seconds</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100/50 max-w-xl flex items-start gap-4">
        <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm mt-1">
          <Heart size={20} fill="currentColor" />
        </div>
        <div>
          <h5 className="font-black text-emerald-900 uppercase tracking-wider text-xs mb-1 italic">Flora's Promise</h5>
          <p className="text-emerald-700/80 text-sm font-medium leading-relaxed italic">
            "Every word you share is heard with care. I'm here as your emotional companion, rain or shine. 🌿💚"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoulSession;