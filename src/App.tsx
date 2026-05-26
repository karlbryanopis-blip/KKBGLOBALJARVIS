import { useState, useEffect, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Brain, Zap, Shield, Network, BarChart3, Cpu,
  ChevronRight, ArrowRight, Terminal, Globe, Lock,
  Users, Clock, CheckCircle, Send, Menu, X,
  Activity, Database, Code2, Layers, Target, TrendingUp,
  Star, Mail, Phone, Calendar, AlertCircle, Eye, Cloud
} from 'lucide-react';

// --- Hook: Scroll Reveal ---
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// --- Hook: Mouse Position ---
function useMouse() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

// --- Component: Cursor Glow ---
function CursorGlow() {
  const { x, y } = useMouse();
  return <div className="cursor-glow hidden md:block" style={{ left: x, top: y }} />;
}

// --- Component: Particle Field ---
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div key={i} className="particle" style={{
          left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
          opacity: p.opacity, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// --- Component: Data Rain ---
function DataRain() {
  const columns = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      x: (i / 20) * 100 + Math.random() * 3,
      speed: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      chars: Array.from({ length: 20 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join(''),
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {columns.map((col, i) => (
        <div key={i} className="absolute font-mono-tech text-xs" style={{
          left: `${col.x}%`, top: 0, color: 'rgba(0,212,255,0.4)',
          animation: `data-rain ${col.speed}s linear ${col.delay}s infinite`,
          writingMode: 'vertical-rl', letterSpacing: '0.3em', whiteSpace: 'nowrap',
        }}>
          {col.chars}
        </div>
      ))}
    </div>
  );
}

// --- Component: Radar Sweep ---
function RadarSweep({ size = 120 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[0.33, 0.66, 1].map((s, i) => (
        <div key={i} className="absolute rounded-full" style={{ inset: `${(1 - s) * 50}%`, border: '1px solid rgba(0,212,255,0.15)' }} />
      ))}
      <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(0,212,255,0.1)' }} />
      <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'rgba(0,212,255,0.1)' }} />
      <div className="absolute inset-0 rounded-full" style={{
        background: 'conic-gradient(from 0deg, rgba(0,212,255,0.3), transparent 60deg)',
        animation: 'radar-sweep 4s linear infinite', transformOrigin: 'center',
      }} />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.8)' }} />
      <div className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ top: '25%', left: '60%', background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.8)' }} />
      <div className="absolute w-1 h-1 rounded-full animate-pulse"
        style={{ top: '55%', left: '30%', background: 'rgba(0,212,255,0.6)', animationDelay: '1s' }} />
    </div>
  );
}

// --- Component: Waveform ---
function Waveform({ bars = 30, height = 40 }: { bars?: number; height?: number }) {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2));
    }, 150);
    return () => clearInterval(interval);
  }, [bars]);

  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all duration-150" style={{
          height: `${(heights[i] || 0.3) * 100}%`,
          background: `rgba(0,212,255,${0.3 + (heights[i] || 0.3) * 0.5})`,
          minWidth: 2,
          boxShadow: heights[i] > 0.6 ? '0 0 4px rgba(0,212,255,0.4)' : 'none',
        }} />
      ))}
    </div>
  );
}

// --- Component: Orbiting Dots ---
function OrbitingDots({ radius = 60 }: { radius?: number }) {
  return (
    <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full" style={{
          top: '50%', left: '50%',
          background: i === 0 ? '#00d4ff' : 'rgba(0,212,255,0.4)',
          boxShadow: i === 0 ? '0 0 8px rgba(0,212,255,0.8)' : '0 0 4px rgba(0,212,255,0.3)',
          animation: `orbit ${6 + i * 2}s linear infinite`, animationDelay: `${i * 1.5}s`,
        }} />
      ))}
    </div>
  );
}

// --- Component: Arc Reactor ---
function ArcReactor({ size = 200 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ border: '1px solid rgba(0,212,255,0.2)', borderTopColor: 'rgba(0,212,255,0.8)', borderRightColor: 'rgba(0,212,255,0.4)' }} />
      <div className="absolute rounded-full animate-counter-spin" style={{ inset: '15%', border: '1px solid rgba(0,212,255,0.15)', borderBottomColor: 'rgba(0,212,255,0.7)', borderLeftColor: 'rgba(0,212,255,0.3)' }} />
      <div className="absolute rounded-full animate-spin-slow" style={{ inset: '30%', border: '2px solid rgba(0,212,255,0.3)', borderTopColor: '#00d4ff', animationDuration: '4s', boxShadow: '0 0 10px rgba(0,212,255,0.4)' }} />
      <div className="absolute rounded-full" style={{ inset: '40%', background: 'radial-gradient(circle, #00d4ff 0%, #0099bb 40%, #003344 100%)', boxShadow: '0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)', animation: 'arc-pulse 3s ease-in-out infinite' }} />
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="absolute" style={{
          width: 2, height: size * 0.06,
          background: i % 3 === 0 ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.3)',
          left: '50%', top: 0, transformOrigin: `1px ${size / 2}px`,
          transform: `rotate(${i * 30}deg) translateX(-50%)`,
        }} />
      ))}
    </div>
  );
}

// --- Component: Typing Text ---
function TypingText({ text, speed = 60, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className="font-mono-tech">
      {displayed}
      {displayed.length < text.length && (
        <span style={{ color: '#00d4ff', animation: 'cursor-blink 0.8s ease-in-out infinite' }}>_</span>
      )}
    </span>
  );
}

// --- Component: HUD Corner ---
function HUDCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positions: Record<string, string> = { tl: 'top-0 left-0', tr: 'top-0 right-0 rotate-90', bl: 'bottom-0 left-0 -rotate-90', br: 'bottom-0 right-0 rotate-180' };
  return (
    <div className={`absolute ${positions[position]} w-6 h-6`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M2 2 L12 2 L12 4 L4 4 L4 12 L2 12 Z" fill="rgba(0,212,255,0.7)" />
      </svg>
    </div>
  );
}

// --- Component: Stat Card (Framer Motion) ---
function StatCard({ value, label, icon: Icon, delay }: { value: string; label: string; icon: React.ElementType; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const num = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.includes('M+') ? 'M+' : value.includes('+') ? '+' : value.includes('%') ? '%' : value.includes('wk') ? ' wk' : '';
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v: number) => Math.floor(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, num, { duration: 1.8, delay: delay / 1000, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, num, delay, motionVal]);

  const [displayVal, setDisplayVal] = useState(0);
  useEffect(() => {
    const unsubscribe = rounded.on('change', (v: number) => setDisplayVal(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: 'easeOut' }}
      className="jarvis-panel glow-box-hover corner-bracket p-6 text-center">
      <div className="flex justify-center mb-3">
        <div className="p-3 rounded-full animate-glow-pulse" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
          <Icon size={20} style={{ color: '#00d4ff' }} />
        </div>
      </div>
      <div className="font-orbitron text-3xl font-bold glow-cyan stat-counter" style={{ color: '#00d4ff' }}>
        {displayVal}{suffix}
      </div>
      <div className="font-rajdhani text-sm mt-1 tracking-widest uppercase" style={{ color: 'rgba(0,212,255,0.5)' }}>
        {label}
      </div>
    </motion.div>
  );
}

// --- Component: Service Card (Framer Motion) ---
function ServiceCard({ icon: Icon, title, desc, features, index }: { icon: React.ElementType; title: string; desc: string; features: string[]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="jarvis-panel corner-bracket p-6 cursor-default"
      style={{
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 0 40px rgba(0,212,255,0.25), inset 0 0 30px rgba(0,212,255,0.05)' : '0 0 20px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.03)',
        borderColor: hovered ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="progress-bar mb-4" />
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 p-3 rounded transition-all duration-300" style={{
          background: hovered ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.08)',
          border: `1px solid ${hovered ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.2)'}`,
          transform: hovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)',
        }}>
          <Icon size={22} style={{ color: '#00d4ff' }} />
        </div>
        <div>
          <div className="font-orbitron text-sm font-semibold mb-2" style={{ color: '#e0f4ff', letterSpacing: '0.05em' }}>{title}</div>
          <div className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)' }}>{desc}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {features.map(f => (
          <div key={f} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)' }}>
            <div className="w-1 h-1 rounded-full" style={{ background: '#00d4ff' }} />
            <span className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{f}</span>
          </div>
        ))}
      </div>
      <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>
        SYS.MODULE_{String(index + 1).padStart(2, '0')}
      </div>
      <div className="mt-3 overflow-hidden" style={{ height: hovered ? 2 : 0, transition: 'height 0.3s ease' }}>
        <svg width="100%" height="2" className="overflow-visible">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#00d4ff" strokeWidth="1" style={{ strokeDasharray: 200, strokeDashoffset: hovered ? 0 : 200, transition: 'stroke-dashoffset 0.8s ease', opacity: hovered ? 0.6 : 0 }} />
        </svg>
      </div>
    </motion.div>
  );
}

// --- Component: Process Step ---
function ProcessStep({ num, title, desc, active }: { num: string; title: string; desc: string; active: boolean }) {
  return (
    <div className={`flex gap-6 items-start transition-all duration-500 ${active ? 'opacity-100' : 'opacity-50'}`}>
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-orbitron font-bold text-sm transition-all duration-500" style={{
          border: `2px solid ${active ? '#00d4ff' : 'rgba(0,212,255,0.3)'}`,
          color: active ? '#00d4ff' : 'rgba(0,212,255,0.4)',
          background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
          boxShadow: active ? '0 0 20px rgba(0,212,255,0.3)' : 'none',
          transform: active ? 'scale(1.1)' : 'scale(1)',
        }}>{num}</div>
        <div className="w-px flex-1 mt-2 transition-all duration-500" style={{
          background: active ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.15)', minHeight: 40,
          boxShadow: active ? '0 0 6px rgba(0,212,255,0.3)' : 'none'
        }} />
      </div>
      <div className="pt-2 pb-6">
        <div className="font-orbitron text-sm font-semibold mb-2 transition-colors duration-500" style={{ color: active ? '#e0f4ff' : 'rgba(224,244,255,0.5)' }}>{title}</div>
        <div className="font-rajdhani text-base leading-relaxed transition-colors duration-500" style={{ color: active ? 'rgba(224,244,255,0.6)' : 'rgba(224,244,255,0.35)' }}>{desc}</div>
        {active && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.8)' }} />
            <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.5)' }}>ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Component: Testimonial ---
function Testimonial({ quote, name, role, company, index }: { quote: string; name: string; role: string; company: string; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`jarvis-panel corner-bracket p-6 h-full reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="progress-bar mb-5" />
      <div className="font-mono-tech text-xs mb-4" style={{ color: 'rgba(0,212,255,0.4)' }}>// CLIENT.TESTIMONIAL</div>
      <p className="font-rajdhani text-base leading-relaxed mb-6" style={{ color: 'rgba(224,244,255,0.75)' }}>"{quote}"</p>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.15)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron text-xs font-bold animate-glow-pulse"
          style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
          {name[0]}
        </div>
        <div>
          <div className="font-orbitron text-xs font-semibold" style={{ color: '#e0f4ff' }}>{name}</div>
          <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.5)' }}>{role}, {company}</div>
        </div>
      </div>
    </div>
  );
}

// --- Component: FAQ Item ---
function FAQItem({ faq, index, open, onToggle }: { faq: { q: string; a: string }; index: number; open: boolean; onToggle: () => void }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`jarvis-panel reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <button className="w-full text-left p-5 flex items-center justify-between gap-4" onClick={onToggle}>
        <span className="font-orbitron text-sm font-semibold" style={{ color: '#e0f4ff' }}>{faq.q}</span>
        <ChevronRight size={16} style={{ color: '#00d4ff', transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s ease', flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="px-5 pb-5 font-rajdhani text-base leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)', borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: 16 }}>
          {faq.a}
        </div>
      </div>
    </div>
  );
}

// --- Component: Hex Grid ---
function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexPattern" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <path d="M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v31l26 15z" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="0.5" style={{ animation: 'hex-pulse 4s ease-in-out infinite' }} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  );
}

// --- Wrapper: Reveal on Scroll ---
function RevealWrapper({ children, direction = 'up' }: { children: React.ReactNode; direction?: 'up' | 'left' | 'right' }) {
  const { ref, visible } = useReveal();
  const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';
  return <div ref={ref} className={`${cls} ${visible ? 'visible' : ''}`}>{children}</div>;
}

// ====== MAIN APP ======
export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'case-studies'>('home');
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [submitted, setSubmitted] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date());
  const [glitchTitle, setGlitchTitle] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const openCalendly = () => window.open('https://calendly.com/karlbryanopis/30min', '_blank', 'noopener,noreferrer');

  useEffect(() => { const timer = setInterval(() => setSystemTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  useEffect(() => { const interval = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000); return () => clearInterval(interval); }, []);
  useEffect(() => { const interval = setInterval(() => { setGlitchTitle(true); setTimeout(() => setGlitchTitle(false), 300); }, 8000); return () => clearInterval(interval); }, []);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.message.trim()) {
      errors.message = 'Please describe what you are building';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Please provide at least 20 characters';
    }
    return errors;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setFormStatus('sending');
    try {
      const name = formData.name.trim();
      const email = formData.email.trim();
      const company = formData.company.trim();
      const message = formData.message.trim();

      await emailjs.send(
        'service_jiiwuj9',
        'template_g40rdwu',
        {
          name,
          email,
          company,
          message,
          body: `From: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      setFormStatus('success');
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  };

  const services = [
    { icon: Brain, title: 'Full-Stack AI Development', desc: 'Custom ML models, LLM apps, RAG, fine-tuning and AI agents — shipped to production.', features: ['LLM application development', 'RAG & vector search', 'Fine-tuning & evaluation', 'Computer vision & NLP'] },
    { icon: Target, title: 'AI Consulting & Strategy', desc: 'Audits, roadmaps and executive workshops to turn AI hype into measurable outcomes.', features: ['Opportunity audits', 'Executive workshops', 'Build vs. buy analysis', 'AI roadmaps'] },
    { icon: Database, title: 'Data & Automation', desc: 'ETL pipelines, RPA and intelligent workflow automation across your stack.', features: ['Data pipelines & warehouses', 'RPA & process automation', 'Internal tools', 'Integrations'] },
    { icon: Network, title: 'Agents & Copilots', desc: 'Autonomous agents and embedded copilots that work alongside your team.', features: ['Tool-using agents', 'Multi-agent systems', 'Voice & chat copilots', 'Human-in-the-loop'] },
    { icon: Layers, title: 'MLOps & Infrastructure', desc: 'Scalable model serving, evals, monitoring and cost optimization on any cloud.', features: ['Model serving & scaling', 'Evals & observability', 'Cost optimization', 'CI/CD for ML'] },
    { icon: Shield, title: 'Responsible AI', desc: 'Governance, security and compliance baked in — from day one.', features: ['SOC 2 & GDPR', 'EU AI Act readiness', 'Red-teaming', 'Bias & safety evals'] },
  ];

  const steps = [
    { num: '01', title: 'DISCOVER', desc: 'Map data, workflows and high-leverage AI opportunities.' },
    { num: '02', title: 'PROTOTYPE', desc: 'Working proof-of-concept in two weeks on real data.' },
    { num: '03', title: 'PRODUCTIONIZE', desc: 'Hardened deployment with evals, monitoring and human-in-the-loop.' },
    { num: '04', title: 'SCALE', desc: 'Embed with team to compound results across business.' },
  ];

  const testimonials = [
    { quote: "KKB shipped our LLM copilot in six weeks. Our internal team would have taken six months — and the result wouldn't have been this polished.", name: 'Mira Halvorsen', role: 'CTO', company: 'Northwind Logistics' },
    { quote: "They operate like a senior in-house team, not an agency. Daily standups, eval-driven development, ruthless focus on production quality.", name: 'David Okafor', role: 'VP Engineering', company: 'Helios Health' },
    { quote: "Best AI consultancy we've worked with — and we've tried four. They actually understand MLOps, evals, and the boring stuff that makes things work.", name: 'Aiko Tanaka', role: 'Head of AI', company: 'Quanta Capital' },
  ];

  const navLinks = currentPage === 'home'
    ? ['Services', 'Work', 'About', 'FAQ', 'Blog', 'Contact']
    : ['Services', 'Work', 'About', 'FAQ', 'Blog', 'Contact'];
  const companyNames = ['NORTHWIND', 'ACME AI', 'LUMEN', 'VECTOR', 'HELIOS', 'QUANTA', 'APEX', 'NIMBUS'];

  const handleNavClick = (link: string) => {
    if (link === 'Blog') {
      setCurrentPage('blog');
      window.scrollTo(0, 0);
    } else if (link === 'Work') {
      setCurrentPage('case-studies');
      window.scrollTo(0, 0);
    } else if (link === 'Services' || link === 'About' || link === 'FAQ' || link === 'Contact') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(link.toLowerCase());
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#050d1a' }}>
      <CursorGlow />

      {/* ====== STICKY BOOK A CALL BUTTON ====== */}
      <motion.button
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: scrolled ? 1 : 0, x: scrolled ? 0 : 40 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={() => openCalendly()}
        className="fixed right-6 bottom-8 z-[90] flex items-center gap-2 px-5 py-3 rounded-full font-orbitron font-bold text-sm shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,153,187,0.2))',
          border: '1px solid rgba(0,212,255,0.6)',
          color: '#00d4ff',
          boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}>
        <Calendar size={15} />
        Book a Call
      </motion.button>

      {/* ====== BOOKING BANNER ====== */}
      <div className="fixed top-0 left-0 right-0 z-[60] py-2 text-center transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(0,40,60,0.9)' : 'rgba(0,40,60,0.7)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,212,255,0.2)',
          transform: scrolled ? 'translateY(0)' : 'translateY(0)',
        }}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4ff' }} />
          <span className="font-rajdhani text-sm" style={{ color: 'rgba(224,244,255,0.8)' }}>
            Now booking Q3 engagements
          </span>
          <span style={{ color: 'rgba(0,212,255,0.4)' }}>&middot;</span>
          <span className="font-orbitron text-xs font-bold" style={{ color: '#00d4ff' }}>3 slots remaining</span>
        </div>
      </div>

      {/* ====== NAV ====== */}
      <motion.nav
        animate={{
          background: scrolled ? 'rgba(5,13,26,0.95)' : 'rgba(5,13,26,0)',
          borderBottomWidth: scrolled ? 1 : 0,
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{
          top: 36,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottomColor: 'rgba(0,212,255,0.15)',
        }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 0 12px rgba(0,212,255,0.35)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <img src="/6e28394e-b865-4e7a-ba22-0a1e4f83a7cb.jpg" alt="KKB Global Solutions" className="w-full h-full object-cover" style={{ transform: 'scale(1.08)', transformOrigin: 'center' }} />
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(0,212,255,0.08)', mixBlendMode: 'screen' }} />
            </div>
            <div>
              <div className="font-orbitron font-bold text-sm tracking-widest glow-cyan" style={{ color: '#00d4ff' }}>KKB</div>
              <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)', letterSpacing: '0.2em' }}>GLOBAL.SYS</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button key={link} onClick={() => handleNavClick(link)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>{link}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>
              {systemTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <button onClick={() => openCalendly()} className="btn-jarvis flex items-center gap-2 px-5 py-2 rounded"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', cursor: 'pointer' }}>
              <Phone size={12} /> Book a call
            </button>
          </div>

          <button className="md:hidden" style={{ color: '#00d4ff' }} onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden border-t" style={{ background: 'rgba(5,13,26,0.98)', borderColor: 'rgba(0,212,255,0.2)' }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <button key={link} onClick={() => { handleNavClick(link); setNavOpen(false); }} className="nav-link py-2" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>{link}</button>
              ))}
              <button onClick={() => { openCalendly(); setNavOpen(false); }} className="btn-jarvis text-center px-5 py-3 rounded mt-2"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', cursor: 'pointer' }}>
                Book a call
              </button>
            </div>
          </div>
        )}
      </motion.nav>

      {currentPage === 'home' ? (
        <>
      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center grid-bg hex-bg overflow-hidden">
        <ParticleField />
        <DataRain />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-morph"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none animate-morph"
          style={{ background: 'radial-gradient(circle, rgba(0,150,200,0.06) 0%, transparent 70%)', filter: 'blur(40px)', animationDelay: '-4s' }} />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-px animate-scan" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }} />
        </div>

        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2">
          {['NEURAL.LINK', 'SYS.READY', 'AI.ONLINE', 'DATA.FLOW', 'SYNC.OK'].map((t, i) => (
            <div key={t} className="font-mono-tech text-xs animate-flicker" style={{ color: `rgba(0,212,255,${0.2 + i * 0.05})`, letterSpacing: '0.2em', animationDelay: `${i * 0.5}s` }}>{t}</div>
          ))}
        </div>

        <div className="absolute right-8 top-1/3 hidden xl:flex flex-col gap-8 items-center">
          <RadarSweep size={100} />
          <Waveform bars={20} height={30} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: '#00d4ff' }} />
              <div className="font-mono-tech text-xs tracking-widest animate-flicker" style={{ color: 'rgba(0,212,255,0.6)' }}>
                SYSTEM ONLINE // KKB GLOBAL SOLUTIONS
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className={`font-orbitron font-black mb-6 leading-tight ${glitchTitle ? 'animate-glitch' : ''}`} style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              <span style={{ color: '#e0f4ff' }}>YOUR OUTSOURCED</span>
              <br />
              <span className="gradient-cyan glow-cyan">AI ENGINEERING</span>
              <br />
              <span style={{ color: '#e0f4ff' }}>TEAM.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
              className="font-rajdhani text-lg mb-8 leading-relaxed" style={{ color: 'rgba(224,244,255,0.65)', maxWidth: 520 }}>
              <TypingText text="Design, build and deploy production AI for ambitious teams — from LLM applications to autonomous agents and ML infrastructure." speed={25} delay={800} />
            </motion.div>

            {/* Trust metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#00d4ff" style={{ color: '#00d4ff' }} />)}
                </div>
                <span className="font-orbitron text-xs font-bold" style={{ color: '#00d4ff' }}>4.9</span>
                <span className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>with 120+ projects shipped</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Shield size={12} style={{ color: '#00d4ff' }} />
                <span className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>SOC 2 &middot; GDPR &middot; EU AI Act ready</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
              className="flex flex-wrap gap-4">
              <button onClick={() => openCalendly()} className="btn-jarvis flex items-center gap-2 px-7 py-3 rounded"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,153,187,0.15))', border: '1px solid rgba(0,212,255,0.6)', color: '#00d4ff', boxShadow: '0 0 20px rgba(0,212,255,0.2)', cursor: 'pointer' }}>
                Start a project <ArrowRight size={14} />
              </button>
              <a href="#services" className="btn-jarvis flex items-center gap-2 px-7 py-3 rounded"
                style={{ background: 'transparent', border: '1px solid rgba(0,212,255,0.25)', color: 'rgba(224,244,255,0.7)' }}>
                Explore services <ChevronRight size={14} />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="flex justify-center">
            <div className="relative">
              <div className="relative animate-float" style={{ width: 320, height: 320 }}>
                {/* Outer animated ring */}
                <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ border: '1px solid rgba(0,212,255,0.2)', borderTopColor: 'rgba(0,212,255,0.8)', borderRightColor: 'rgba(0,212,255,0.4)' }} />
                {/* Counter ring */}
                <div className="absolute rounded-full animate-counter-spin" style={{ inset: '6%', border: '1px solid rgba(0,212,255,0.12)', borderBottomColor: 'rgba(0,212,255,0.6)', borderLeftColor: 'rgba(0,212,255,0.25)' }} />
                {/* Inner glow ring */}
                <div className="absolute rounded-full animate-spin-slow" style={{ inset: '14%', border: '2px solid rgba(0,212,255,0.2)', borderTopColor: '#00d4ff', animationDuration: '4s', boxShadow: '0 0 10px rgba(0,212,255,0.3)' }} />
                {/* Tick marks */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute" style={{
                    width: 2, height: 18,
                    background: i % 3 === 0 ? 'rgba(0,212,255,0.7)' : 'rgba(0,212,255,0.25)',
                    left: '50%', top: 0, transformOrigin: `1px 160px`,
                    transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  }} />
                ))}
                {/* Logo circle */}
                <div className="absolute rounded-full overflow-hidden" style={{
                  inset: '18%',
                  boxShadow: '0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)',
                  border: '2px solid rgba(0,212,255,0.4)',
                }}>
                  <img src="/6e28394e-b865-4e7a-ba22-0a1e4f83a7cb.jpg" alt="KKB Global Solutions" className="w-full h-full object-cover" style={{ transform: 'scale(1.08)', transformOrigin: 'center' }} />
                  {/* Cyan tint overlay to blend with UI */}
                  <div className="absolute inset-0" style={{ background: 'rgba(0,60,90,0.25)', mixBlendMode: 'multiply' }} />
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,212,255,0.12) 100%)' }} />
                </div>
                {/* Ambient pulse behind logo */}
                <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%)' }} />
                {/* Orbiting dots */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <OrbitingDots radius={170} />
                </div>
                {/* HUD panels */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -top-4 -right-8 jarvis-panel px-3 py-2" style={{ minWidth: 130 }}>
                  <div className="font-mono-tech text-xs mb-1" style={{ color: 'rgba(0,212,255,0.5)' }}>NEURAL.NET</div>
                  <div className="font-orbitron text-sm font-bold" style={{ color: '#00d4ff' }}>ONLINE</div>
                  <div className="progress-bar mt-1" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="absolute -bottom-4 -left-12 jarvis-panel px-3 py-2" style={{ minWidth: 140 }}>
                  <div className="font-mono-tech text-xs mb-1" style={{ color: 'rgba(0,212,255,0.5)' }}>MODELS.ACTIVE</div>
                  <div className="font-orbitron text-sm font-bold" style={{ color: '#00d4ff' }}>47 RUNNING</div>
                  <div className="progress-bar mt-1" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2.0 }}
                  className="absolute top-1/2 -right-16 -translate-y-1/2 jarvis-panel px-3 py-2" style={{ minWidth: 120 }}>
                  <div className="font-mono-tech text-xs mb-1" style={{ color: 'rgba(0,212,255,0.5)' }}>UPTIME</div>
                  <div className="font-orbitron text-sm font-bold" style={{ color: '#00d4ff' }}>99.9%</div>
                  <div className="progress-bar mt-1" />
                </motion.div>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 65%)', filter: 'blur(20px)' }} />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-3"
          style={{ borderTop: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.03)' }}>
          <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>SYS.STATUS: NOMINAL</div>
          <div className="hidden md:flex items-center gap-6">
            {['LLM', 'RAG', 'AGENT', 'MLOPS'].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4ff', animationDelay: `${Math.random() * 2}s` }} />
                <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{systemTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
        </div>
      </section>

      {/* ====== TRUSTED BY — MARQUEE ====== */}
      <section className="py-12 overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="font-mono-tech text-xs text-center tracking-widest" style={{ color: 'rgba(0,212,255,0.4)' }}>// TRUSTED.BY.TEAMS.AT</div>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #050d1a, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #050d1a, transparent)' }} />
          <div className="marquee-track">
            {[...companyNames, ...companyNames, ...companyNames, ...companyNames].map((name, i) => (
              <div key={i} className="flex-shrink-0 mx-10 font-orbitron text-sm font-bold tracking-widest transition-colors duration-300 hover:text-cyan-300" style={{ color: 'rgba(0,212,255,0.5)' }}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SOCIAL PROOF BANNER ====== */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.06) 0%, rgba(0,212,255,0.12) 50%, rgba(0,212,255,0.06) 100%)', borderTop: '1px solid rgba(0,212,255,0.15)', borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { value: '120+', label: 'Models in Production' },
              { value: '40M+', label: 'Inferences per Day' },
              { value: '98%', label: 'Client Retention' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="hidden md:block w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />}
                <div className="text-center">
                  <div className="font-orbitron font-black text-2xl md:text-3xl glow-cyan" style={{ color: '#00d4ff' }}>{stat.value}</div>
                  <div className="font-rajdhani text-xs tracking-widest uppercase" style={{ color: 'rgba(224,244,255,0.5)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
            <div className="hidden md:block w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: 'SOC 2 Type II', icon: Shield },
                { label: 'GDPR Compliant', icon: Lock },
                { label: 'EU AI Act Ready', icon: CheckCircle },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Icon size={11} style={{ color: '#00d4ff' }} />
                  <span className="font-mono-tech text-xs" style={{ color: 'rgba(224,244,255,0.7)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== STATS ====== */}
      <section id="results" className="py-20 grid-bg relative overflow-hidden">
        <HexGrid />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="120+" label="Models in Production" icon={Cpu} delay={0} />
            <StatCard value="40M+" label="Inferences per Day" icon={BarChart3} delay={100} />
            <StatCard value="12 wk" label="Average Time to Value" icon={Clock} delay={200} />
            <StatCard value="98%" label="Client Retention" icon={TrendingUp} delay={300} />
          </div>
        </div>
      </section>

      {/* ====== LOGO WALL ====== */}
      <section className="py-16 overflow-hidden" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="font-mono-tech text-xs tracking-widest" style={{ color: 'rgba(0,212,255,0.4)' }}>
              TRUSTED PARTNERS &amp; ECOSYSTEM
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { name: 'Anthropic', icon: Brain },
              { name: 'OpenAI', icon: Cpu },
              { name: 'AWS', icon: Cloud },
              { name: 'Google Cloud', icon: Globe },
              { name: 'Microsoft Azure', icon: Layers },
              { name: 'Hugging Face', icon: Database },
              { name: 'LangChain', icon: Network },
              { name: 'Nvidia', icon: Zap },
            ].map(({ name, icon: Icon }) => (
              <motion.div
                key={name}
                whileHover={{ opacity: 1, scale: 1.08 }}
                className="flex items-center gap-2 px-5 py-3 rounded"
                style={{
                  background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.1)',
                  opacity: 0.55,
                  transition: 'opacity 0.2s',
                }}>
                <Icon size={16} style={{ color: '#00d4ff' }} />
                <span className="font-orbitron text-xs font-semibold" style={{ color: 'rgba(224,244,255,0.7)' }}>{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-24 relative overflow-hidden">
        <ParticleField />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4))' }} />
              <div className="font-mono-tech text-xs tracking-widest animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>WHAT.WE.DO</div>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.4), transparent)' }} />
            </div>
            <RevealWrapper>
              <h2 className="font-orbitron font-bold text-center mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#e0f4ff' }}>
                END-TO-END AI, DELIVERED BY
                <br /><span className="gradient-cyan glow-cyan">SENIOR ENGINEERS.</span>
              </h2>
            </RevealWrapper>
            <p className="text-center font-rajdhani text-lg max-w-2xl mx-auto" style={{ color: 'rgba(224,244,255,0.55)' }}>
              One partner across the entire AI lifecycle — strategy, prototyping, production, and the unglamorous infrastructure that keeps it all running.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => <ServiceCard key={s.title} {...s} index={i} />)}
          </div>

          {/* Platform Expertise & Client Results */}
          <RevealWrapper>
            <div className="mt-16">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Platform Expertise */}
                <div className="jarvis-panel p-6 rounded">
                  <div className="font-mono-tech text-xs tracking-widest mb-5" style={{ color: 'rgba(0,212,255,0.5)' }}>PLATFORM.EXPERTISE</div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        name: 'Zapier',
                        badge: 'Certified Expert',
                        color: '#ff4a00',
                        bg: 'rgba(255,74,0,0.07)',
                        border: 'rgba(255,74,0,0.2)',
                        logo: (
                          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                            <rect width="64" height="64" rx="12" fill="#FF4A00"/>
                            <path d="M32 12L52 24V40L32 52L12 40V24L32 12Z" fill="none" stroke="white" strokeWidth="2.5"/>
                            <path d="M22 32H42M32 22V42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                            <circle cx="32" cy="32" r="4" fill="white"/>
                          </svg>
                        ),
                      },
                      {
                        name: 'n8n',
                        badge: 'Creator Partner',
                        color: '#ea4b71',
                        bg: 'rgba(234,75,113,0.07)',
                        border: 'rgba(234,75,113,0.2)',
                        logo: (
                          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                            <rect width="64" height="64" rx="12" fill="#1a1a2e"/>
                            <circle cx="16" cy="32" r="7" fill="#ea4b71"/>
                            <circle cx="32" cy="32" r="7" fill="#ea4b71"/>
                            <circle cx="48" cy="32" r="7" fill="#ea4b71"/>
                            <line x1="23" y1="32" x2="25" y2="32" stroke="#ea4b71" strokeWidth="2"/>
                            <line x1="39" y1="32" x2="41" y2="32" stroke="#ea4b71" strokeWidth="2"/>
                          </svg>
                        ),
                      },
                      {
                        name: 'Make.com',
                        badge: 'Gold Partner',
                        color: '#6d00cc',
                        bg: 'rgba(109,0,204,0.07)',
                        border: 'rgba(109,0,204,0.25)',
                        logo: (
                          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                            <rect width="64" height="64" rx="12" fill="#6d00cc"/>
                            <circle cx="20" cy="32" r="6" fill="white" fillOpacity="0.9"/>
                            <circle cx="32" cy="32" r="6" fill="white" fillOpacity="0.9"/>
                            <circle cx="44" cy="32" r="6" fill="white" fillOpacity="0.9"/>
                            <path d="M26 32 Q29 24 32 32 Q35 40 38 32" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                          </svg>
                        ),
                      },
                      {
                        name: 'Go High Level',
                        badge: 'Affiliate Partner',
                        color: '#00b4d8',
                        bg: 'rgba(0,180,216,0.07)',
                        border: 'rgba(0,180,216,0.2)',
                        logo: (
                          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                            <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
                            <path d="M32 14C22.06 14 14 22.06 14 32C14 41.94 22.06 50 32 50C41.94 50 50 41.94 50 32H38C38 35.31 35.31 38 32 38C28.69 38 26 35.31 26 32C26 28.69 28.69 26 32 26C33.66 26 35.16 26.67 36.24 27.76L44.14 19.86C41.07 17.1 37.23 14 32 14Z" fill="#00b4d8"/>
                          </svg>
                        ),
                      },
                      {
                        name: 'WordPress',
                        badge: 'VIP Agency',
                        color: '#21759b',
                        bg: 'rgba(33,117,155,0.07)',
                        border: 'rgba(33,117,155,0.2)',
                        logo: (
                          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none">
                            <rect width="64" height="64" rx="12" fill="#21759b"/>
                            <circle cx="32" cy="32" r="18" stroke="white" strokeWidth="2" fill="none"/>
                            <path d="M14 32C14 32 20 28 24 32C28 36 32 28 36 32C40 36 44 28 50 32" stroke="white" strokeWidth="2" fill="none"/>
                            <line x1="32" y1="14" x2="32" y2="50" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
                          </svg>
                        ),
                      },
                    ].map(p => (
                      <div key={p.name} className="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                        style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                        <div className="flex-shrink-0">{p.logo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-orbitron text-sm font-bold" style={{ color: '#e0f4ff' }}>{p.name}</div>
                          <div className="font-mono-tech text-[10px] mt-0.5" style={{ color: p.color }}>{p.badge}</div>
                        </div>
                        <CheckCircle size={14} style={{ color: p.color, flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Results */}
                <div className="jarvis-panel p-6 rounded">
                  <div className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'rgba(0,212,255,0.5)' }}>CLIENT.RESULTS</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { metric: '1.2M', label: 'Tasks/month automated', sub: 'via Zapier', accent: '#ff6b35' },
                      { metric: '94%', label: 'Cost reduction', sub: 'n8n migration', accent: '#00d4ff' },
                      { metric: '11x', label: 'Faster lead routing', sub: 'Make.com', accent: '#00ff88' },
                      { metric: '$2.4M', label: 'Pipeline generated', sub: 'Go High Level', accent: '#ffc800' },
                      { metric: '98', label: 'Lighthouse score', sub: 'WordPress', accent: '#a855f7' },
                      { metric: '73%', label: 'Routing time cut', sub: 'AI agents', accent: '#00d4ff' },
                    ].map(r => (
                      <div key={r.label} className="p-3 rounded" style={{ background: `${r.accent}05`, border: `1px solid ${r.accent}12` }}>
                        <div className="font-orbitron text-lg font-bold" style={{ color: r.accent }}>{r.metric}</div>
                        <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{r.label}</div>
                        <div className="font-mono-tech text-[9px]" style={{ color: 'rgba(0,212,255,0.3)' }}>{r.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ====== PROCESS ====== */}
      <section id="process" className="py-24 grid-bg" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="font-mono-tech text-xs tracking-widest mb-4 animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>HOW.WE.WORK</div>
            <RevealWrapper>
              <h2 className="font-orbitron font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#e0f4ff' }}>
                FROM WORKSHOP TO PRODUCTION
                <br /><span className="gradient-cyan">IN WEEKS, NOT QUARTERS.</span>
              </h2>
            </RevealWrapper>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>{steps.map((s, i) => <ProcessStep key={s.num} {...s} active={activeStep === i} />)}</div>
            <RevealWrapper direction="right">
              <div className="jarvis-panel corner-bracket p-8 relative overflow-hidden animate-breathing">
                <HUDCorner position="tl" /><HUDCorner position="tr" /><HUDCorner position="bl" /><HUDCorner position="br" />
                <div className="font-mono-tech text-xs mb-6" style={{ color: 'rgba(0,212,255,0.5)' }}>// PROCESS.DIAGNOSTIC.PANEL</div>
                <div className="flex justify-center mb-6"><RadarSweep size={80} /></div>
                <div className="mb-8">
                  <div className="font-orbitron text-4xl font-black mb-2 glow-cyan transition-all duration-500" style={{ color: '#00d4ff' }}>{steps[activeStep].num}</div>
                  <div className="font-orbitron text-xl font-bold mb-3 transition-all duration-500" style={{ color: '#e0f4ff' }}>{steps[activeStep].title}</div>
                  <div className="font-rajdhani text-base leading-relaxed transition-all duration-500" style={{ color: 'rgba(224,244,255,0.6)' }}>{steps[activeStep].desc}</div>
                </div>
                <div className="flex gap-3 mb-8">
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => setActiveStep(i)} className="flex-1 h-1 rounded transition-all duration-300"
                      style={{ background: activeStep === i ? '#00d4ff' : 'rgba(0,212,255,0.2)', boxShadow: activeStep === i ? '0 0 8px rgba(0,212,255,0.6)' : 'none' }} />
                  ))}
                </div>
                <div className="mb-6"><Waveform bars={40} height={24} /></div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'DISCOVERY', val: '3-5 DAYS' },
                    { label: 'PROTOTYPE', val: '2 WEEKS' },
                    { label: 'PRODUCTION', val: '4-6 WEEKS' },
                    { label: 'SCALE', val: 'ONGOING' },
                  ].map(m => (
                    <div key={m.label} className="p-3 rounded transition-all duration-300 hover:border-cyan-400/50" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                      <div className="font-mono-tech text-xs mb-1" style={{ color: 'rgba(0,212,255,0.4)' }}>{m.label}</div>
                      <div className="font-orbitron text-sm font-bold" style={{ color: '#00d4ff' }}>{m.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ====== ABOUT ====== */}
      <section id="about" className="py-24 relative overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <ParticleField />
        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* About Hero */}
          <RevealWrapper>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-8" style={{ background: '#00d4ff' }} />
                <div className="font-mono-tech text-xs tracking-widest animate-flicker" style={{ color: 'rgba(0,212,255,0.6)' }}>
                  ABOUT.KKB
                </div>
                <div className="h-px w-8" style={{ background: '#00d4ff' }} />
              </div>
              <h1 className="font-orbitron font-black mb-8 leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#e0f4ff' }}>
                A small studio of senior AI engineers,
                <br />
                <span className="gradient-cyan glow-cyan">embedded with the teams shaping what's next.</span>
              </h1>
              <p className="font-rajdhani text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: 'rgba(224,244,255,0.6)' }}>
                Founded in 2026 with a distinct mission: we rejected the typical AI consulting model of delivering presentations and instead focused on shipping functional code. We are a remote-based group of experienced engineers creating AI products designed for real-world production environments.
              </p>
            </div>
          </RevealWrapper>

          {/* Core Values — Three Pillars */}
          <RevealWrapper>
            <div className="mb-20">
              <div className="text-center mb-12">
                <div className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  CORE.VALUES
                </div>
                <h2 className="font-orbitron font-bold text-xl" style={{ color: '#e0f4ff' }}>
                  Three principles that define how we work
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: 'Senior by default',
                    desc: 'Every engineer on our team has years of production AI experience. No juniors learning on your dime — every line of code ships from someone who has been there before.',
                    accent: '#00d4ff',
                    bg: 'rgba(0,212,255,0.06)',
                    border: 'rgba(0,212,255,0.2)',
                  },
                  {
                    icon: Target,
                    title: 'Outcomes over output',
                    desc: 'We measure success through business metrics — not development metrics. Shipping features means nothing if they don\'t move the needle on what matters to you.',
                    accent: '#00ff88',
                    bg: 'rgba(0,255,136,0.05)',
                    border: 'rgba(0,255,136,0.15)',
                  },
                  {
                    icon: Eye,
                    title: 'Transparent by design',
                    desc: 'Open repositories, dashboards, and communication channels. You see everything we do, in real time. No black boxes, no surprises, no hidden handoffs.',
                    accent: '#ffc800',
                    bg: 'rgba(255,200,0,0.05)',
                    border: 'rgba(255,200,0,0.15)',
                  },
                ].map((value, i) => (
                  <div key={value.title}
                    className="jarvis-panel corner-bracket p-8 rounded transition-all duration-500 hover:translate-y-[-4px]"
                    style={{ boxShadow: `0 0 20px ${value.bg}` }}>
                    <div className="p-3 rounded-lg inline-flex mb-5 animate-glow-pulse"
                      style={{ background: value.bg, border: `1px solid ${value.border}` }}>
                      <value.icon size={24} style={{ color: value.accent }} />
                    </div>
                    <h3 className="font-orbitron font-bold text-base mb-3" style={{ color: value.accent }}>
                      {value.title}
                    </h3>
                    <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(224,244,255,0.55)' }}>
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealWrapper>

          {/* Origin Story */}
          <RevealWrapper direction="left">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <div className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  ORIGIN.STORY
                </div>
                <h2 className="font-orbitron font-bold mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: '#e0f4ff' }}>
                  WE BUILD INTELLIGENT SYSTEMS
                  <br /><span className="gradient-cyan">THAT COMPOUND.</span>
                </h2>
                <p className="font-rajdhani text-base mb-6 leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)' }}>
                  KKB Global Solutions is the outsourced AI engineering team for ambitious companies. Founded in 2026, we design, build and deploy production-grade AI systems — from LLM applications and autonomous agents to the ML infrastructure that keeps them running.
                </p>
                <p className="font-rajdhani text-base mb-8 leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)' }}>
                  Our team of 40+ senior engineers operates as an embedded extension of your organization. Not an agency — a partner that ships production code, runs daily standups, and takes ownership of outcomes.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: '40+ Engineers', val: 'Senior ML/AI specialists' },
                    { icon: Calendar, label: 'Founded 2026', val: 'Built for the AI-native era' },
                    { icon: Globe, label: 'Remote-First', val: 'Global operations, timezone-agnostic' },
                    { icon: Zap, label: '2-Week Sprints', val: 'From discovery to prototype fast' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded transition-all duration-300 hover:border-cyan-400/40"
                      style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon size={12} style={{ color: '#00d4ff' }} />
                        <span className="font-orbitron text-[10px] font-bold" style={{ color: '#e0f4ff' }}>{item.label}</span>
                      </div>
                      <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.4)' }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostics Panel */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="jarvis-panel corner-bracket p-8 relative" style={{ maxWidth: 380 }}>
                    <HUDCorner position="tl" /><HUDCorner position="br" />
                    <div className="progress-bar mb-6" />
                    <div className="font-mono-tech text-xs mb-6" style={{ color: 'rgba(0,212,255,0.4)' }}>// TEAM.DIAGNOSTICS</div>

                    <div className="flex justify-center mb-6">
                      <RadarSweep size={100} />
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'ML Engineers', pct: 45 },
                        { label: 'LLM / NLP', pct: 30 },
                        { label: 'MLOps / Infra', pct: 15 },
                        { label: 'Strategy', pct: 10 },
                      ].map(b => (
                        <div key={b.label}>
                          <div className="flex justify-between mb-1">
                            <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.5)' }}>{b.label}</span>
                            <span className="font-orbitron text-xs font-bold" style={{ color: '#00d4ff' }}>{b.pct}%</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: 'rgba(0,212,255,0.1)' }}>
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${b.pct}%`, background: 'linear-gradient(90deg, #00d4ff, #0099bb)', boxShadow: '0 0 6px rgba(0,212,255,0.4)' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6"><Waveform bars={35} height={20} /></div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%)', filter: 'blur(20px)' }} />
                </div>
              </div>
            </div>
          </RevealWrapper>

          {/* Leadership Team */}
          <RevealWrapper>
            <div>
              <div className="text-center mb-12">
                <div className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'rgba(0,212,255,0.5)' }}>
                  LEADERSHIP.TEAM
                </div>
                <h2 className="font-orbitron font-bold text-xl" style={{ color: '#e0f4ff' }}>
                  The people behind the systems
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Karl Bryan Opis',
                    role: 'CEO / Founder',
                    desc: 'Sets vision, manages client relationships, and drives strategic direction for KKB\'s growth and market position.',
                    initial: 'KO',
                    accent: '#00d4ff',
                  },
                  {
                    name: 'Vetchie Ann Frando',
                    role: 'Operations Manager',
                    desc: 'Oversees daily operations and team coordination — the operational backbone that keeps 40+ engineers aligned and delivering.',
                    initial: 'VF',
                    accent: '#00ff88',
                  },
                  {
                    name: 'Chief Technology Officer',
                    role: 'CTO',
                    desc: 'Manages architecture and technical standards across all client engagements. Ensures every system ships production-grade.',
                    initial: 'CT',
                    accent: '#ffc800',
                  },
                  {
                    name: 'Head of AI Research',
                    role: 'AI Research Lead',
                    desc: 'Directs model strategy and applied ML research. Bridges the gap between cutting-edge research and production reality.',
                    initial: 'AR',
                    accent: '#a855f7',
                  },
                  {
                    name: 'Head of Engineering',
                    role: 'Engineering Lead',
                    desc: 'Leads delivery teams and production systems. Owns the pipeline from prototype to hardened deployment at scale.',
                    initial: 'HE',
                    accent: '#ff6b35',
                  },
                  {
                    name: 'Head of Product',
                    role: 'Product Lead',
                    desc: 'Connects client goals to roadmaps and business metrics. Translates ambition into executable, measurable sprints.',
                    initial: 'HP',
                    accent: '#00d4ff',
                  },
                ].map((leader, i) => (
                  <div key={leader.name}
                    className="jarvis-panel p-6 rounded transition-all duration-500 hover:translate-y-[-4px] hover:border-cyan-400/40"
                    style={{ boxShadow: `0 0 15px rgba(0,212,255,0.05)` }}>
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-orbitron text-sm font-bold animate-glow-pulse"
                        style={{ background: `${leader.accent}15`, border: `2px solid ${leader.accent}55`, color: leader.accent, boxShadow: `0 0 12px ${leader.accent}30` }}>
                        {leader.initial}
                      </div>
                      <div>
                        <div className="font-orbitron text-xs font-bold" style={{ color: '#e0f4ff' }}>{leader.name}</div>
                        <div className="font-mono-tech text-[10px]" style={{ color: leader.accent }}>{leader.role}</div>
                      </div>
                    </div>
                    {/* Description */}
                    <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(224,244,255,0.5)' }}>
                      {leader.desc}
                    </p>
                    {/* Bottom bar */}
                    <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: leader.accent }} />
                        <span className="font-mono-tech text-[10px]" style={{ color: 'rgba(0,212,255,0.3)' }}>ACTIVE</span>
                      </div>
                      <span className="font-mono-tech text-[10px]" style={{ color: 'rgba(0,212,255,0.2)' }}>SYS.LEAD_{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealWrapper>

        </div>
      </section>

      {/* ====== WORK ====== */}
      <section id="work" className="py-24 relative overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <ParticleField />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs tracking-widest mb-4 animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>
              CASE.STUDIES
            </div>
            <RevealWrapper>
              <h2 className="font-orbitron font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#e0f4ff' }}>
                SHIPPED. MEASURED.
                <br /><span className="gradient-cyan">COMPOUNDED.</span>
              </h2>
            </RevealWrapper>
            <p className="font-rajdhani text-lg max-w-2xl mx-auto" style={{ color: 'rgba(224,244,255,0.55)' }}>
              Real outcomes from real engagements. Every project below shipped to production with measurable business impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                client: 'Northwind Logistics',
                type: 'Agents',
                title: 'Autonomous dispatch agent cuts routing time by 73%',
                metric: '-73%',
                metricLabel: 'Routing time',
                accent: '#00d4ff',
                icon: Network,
              },
              {
                client: 'Lumen Health',
                type: 'LLM App',
                title: 'Clinical copilot summarizing 10k+ patient records daily',
                metric: '10K+',
                metricLabel: 'Records/day',
                accent: '#00ff88',
                icon: Brain,
              },
              {
                client: 'Vector Capital',
                type: 'ML Platform',
                title: 'Real-time fraud detection serving 40M inferences/day',
                metric: '40M',
                metricLabel: 'Inferences/day',
                accent: '#ffc800',
                icon: Shield,
              },
              {
                client: 'Helios Retail',
                type: 'Automation',
                title: 'End-to-end RPA pipeline saving 18,000 hours/year',
                metric: '18K',
                metricLabel: 'Hours saved/year',
                accent: '#ff6b35',
                icon: Database,
              },
            ].map((cs, i) => (
              <RevealWrapper key={cs.client} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="jarvis-panel corner-bracket p-6 rounded h-full transition-all duration-500 hover:translate-y-[-4px] hover:border-cyan-400/40"
                  style={{ boxShadow: `0 0 15px ${cs.accent}10` }}>
                  <div className="progress-bar mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded" style={{ background: `${cs.accent}15`, border: `1px solid ${cs.accent}30` }}>
                        <cs.icon size={16} style={{ color: cs.accent }} />
                      </div>
                      <span className="font-orbitron text-xs font-bold" style={{ color: cs.accent }}>{cs.type}</span>
                    </div>
                    <span className="font-mono-tech text-[10px]" style={{ color: 'rgba(0,212,255,0.3)' }}>CASE_{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="font-rajdhani text-xs mb-1" style={{ color: 'rgba(0,212,255,0.4)' }}>{cs.client}</div>
                  <h3 className="font-orbitron text-sm font-semibold mb-4" style={{ color: '#e0f4ff' }}>{cs.title}</h3>

                  <div className="flex items-center gap-4 p-4 rounded" style={{ background: `${cs.accent}08`, border: `1px solid ${cs.accent}15` }}>
                    <div className="font-orbitron text-2xl font-black" style={{ color: cs.accent, textShadow: `0 0 20px ${cs.accent}40` }}>{cs.metric}</div>
                    <div className="font-rajdhani text-sm" style={{ color: 'rgba(224,244,255,0.5)' }}>{cs.metricLabel}</div>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="py-24 grid-bg relative overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <HexGrid />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs tracking-widest mb-4 animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>FAQ</div>
            <RevealWrapper>
              <h2 className="font-orbitron font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#e0f4ff' }}>
                ANSWERS BEFORE
                <br /><span className="gradient-cyan">YOU ASK.</span>
              </h2>
            </RevealWrapper>
            <p className="font-rajdhani text-base max-w-xl mx-auto" style={{ color: 'rgba(224,244,255,0.55)' }}>
              The questions every founder, CTO, and head of product asks us before starting an engagement. If yours isn't here, we'll answer it on the call.
            </p>
          </div>

          {[
            {
              category: 'Engagements & Pricing',
              icon: Zap,
              items: [
                { q: 'How do engagements typically start?', a: 'Most engagements begin with a one-week strategy sprint where we map your data, workflows, and highest-leverage AI opportunities. This gives both sides a clear picture of scope, timeline, and expected outcomes before committing to a full engagement.' },
                { q: 'What does it cost to work with KKB?', a: 'We offer flexible engagement models — from fixed-scope pilot projects to monthly embedded team arrangements. Costs scale with team size and duration. Contact us for a tailored proposal; we typically respond within one business day.' },
                { q: 'Can we hire you for a single project, or only ongoing work?', a: 'Both. We handle one-off deliverables (e.g., a production RAG pipeline) and long-term embedded partnerships where we function as your AI engineering team. Many clients start with a project and transition to ongoing work after seeing the results.' },
                { q: 'Do you offer fixed-price or time-and-materials?', a: 'We offer both. Fixed-price for well-scoped projects with clear deliverables; time-and-materials for exploratory or evolving engagements where flexibility matters. We always recommend starting with a fixed-scope discovery sprint.' },
              ],
            },
            {
              category: 'Team & Process',
              icon: Users,
              items: [
                { q: 'Who actually does the work?', a: 'Senior engineers — every one of them. No juniors, no handoffs to offshore teams you never meet. The people you talk to in standups are the ones writing your code and deploying your models.' },
                { q: 'How do you collaborate with our internal team?', a: 'We embed directly: daily standups, shared Slack channels, your CI/CD pipelines, your code review process. We adapt to your workflow, not the other way around. Most clients say we feel like an in-house team within the first week.' },
                { q: 'What time zones do you work in?', a: 'Our team spans US, European, and Asian time zones. We schedule overlapping hours with your team for standups and reviews, and stagger off-hours work so progress continues 24/7 when needed.' },
              ],
            },
            {
              category: 'Technology & Delivery',
              icon: Cpu,
              items: [
                { q: 'Which AI models, frameworks, and clouds do you work with?', a: 'All of them. GPT-4, Claude, Gemini, Llama, Mistral — we are model-agnostic. PyTorch, TensorFlow, JAX for training. AWS, GCP, Azure for infrastructure. We also work with Zapier, n8n, Make.com, Go High Level, and WordPress for automation and integration.' },
                { q: 'How do you handle evaluation and quality?', a: 'Eval-driven development is core to our process. We establish metrics before writing code, run automated evals on every deploy, and maintain dashboards that you can monitor in real time. No "it works on my machine" — everything is measured.' },
                { q: 'How quickly can we get something into production?', a: 'Typically 2 weeks for a working prototype, 4-8 weeks for hardened production deployment. The fastest we have gone from first call to production inference was 12 days — but that required an unusually clear scope.' },
              ],
            },
            {
              category: 'Security, IP & Compliance',
              icon: Lock,
              items: [
                { q: 'Who owns the code and the models?', a: 'You do. All code, models, data pipelines, and configurations we build during an engagement are 100% yours. We transfer everything on delivery — no licensing, no lock-in, no hostage assets.' },
                { q: 'How do you handle our data?', a: 'With strict least-privilege access, encryption at rest and in transit, and audit-logged access patterns. We never use client data to train models for other clients. Data isolation is architectural, not procedural.' },
                { q: 'Are you ready for the EU AI Act and other regulations?', a: 'Yes. We build compliance into the architecture from day one — not as an afterthought. We are SOC 2 Type II compliant, GDPR-ready, and can adapt to EU AI Act requirements including risk classification, documentation, and human oversight mechanisms.' },
                { q: 'What happens if we want to part ways?', a: 'You walk away with everything — code, models, documentation, deployment configs, and a full knowledge transfer. We structure engagements so you are never dependent on us. Most departing clients find their internal team can maintain and extend the systems we built without any help.' },
              ],
            },
          ].map((cat, ci) => (
            <div key={cat.category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <cat.icon size={14} style={{ color: '#00d4ff' }} />
                </div>
                <span className="font-orbitron text-xs font-bold tracking-wider" style={{ color: '#00d4ff' }}>{cat.category}</span>
              </div>
              <div className="flex flex-col gap-3">
                {cat.items.map((faq, fi) => {
                  const idx = ci * 10 + fi;
                  return (
                    <FAQItem key={idx} faq={faq} index={idx} open={faqOpen === idx} onToggle={() => setFaqOpen(faqOpen === idx ? null : idx)} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="voices" className="py-24 relative overflow-hidden" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <ParticleField />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'rgba(0,212,255,0.5)' }}>VOICES</div>
            <RevealWrapper>
              <h2 className="font-orbitron font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#e0f4ff' }}>
                LOVED BY THE TEAMS
                <br /><span className="gradient-cyan">WE EMBED WITH.</span>
              </h2>
            </RevealWrapper>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => <Testimonial key={t.name} {...t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(0,80,120,0.1) 50%, rgba(0,212,255,0.05) 100%)', borderTop: '1px solid rgba(0,212,255,0.2)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <ParticleField />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-64 h-64 rounded-full absolute -top-32 -left-32 border border-cyan-500/10 animate-ping-slow" />
          <div className="w-96 h-96 rounded-full absolute -top-48 -left-48 border border-cyan-500/5" style={{ animation: 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <RevealWrapper>
            <div className="font-mono-tech text-xs tracking-widest mb-6" style={{ color: 'rgba(0,212,255,0.5)' }}>// INITIATING.CONTACT.SEQUENCE</div>
            <h2 className="font-orbitron font-black mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#e0f4ff' }}>
              HAVE AN AI PROBLEM
              <br /><span className="gradient-cyan glow-cyan">WORTH SOLVING?</span>
            </h2>
            <p className="font-rajdhani text-lg mb-10 leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)', maxWidth: 560, margin: '0 auto 2.5rem' }}>
              Tell us what you're building. We'll respond within one business day with a clear next step — and no sales theatrics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#contact" className="btn-jarvis inline-flex items-center gap-3 px-10 py-4 rounded font-bold animate-glow-pulse"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,153,187,0.2))', border: '1px solid rgba(0,212,255,0.6)', color: '#00d4ff', boxShadow: '0 0 30px rgba(0,212,255,0.25)', fontSize: '0.85rem' }}>
                <Calendar size={18} /> Book a discovery call
              </a>
              <a href="#services" className="btn-jarvis inline-flex items-center gap-3 px-8 py-4 rounded font-bold"
                style={{ background: 'transparent', border: '1px solid rgba(0,212,255,0.3)', color: 'rgba(224,244,255,0.7)', fontSize: '0.85rem' }}>
                See all services <ChevronRight size={16} />
              </a>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section id="contact" className="py-24 grid-bg relative overflow-hidden">
        <HexGrid />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <RevealWrapper direction="left">
              <div>
                <div className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'rgba(0,212,255,0.5)' }}>CONTACT.TERMINAL</div>
                <h2 className="font-orbitron font-bold mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: '#e0f4ff' }}>
                  INITIALIZE
                  <br /><span className="gradient-cyan">CONTACT SEQUENCE.</span>
                </h2>
                <p className="font-rajdhani text-base mb-10 leading-relaxed" style={{ color: 'rgba(224,244,255,0.55)' }}>
                  The outsourced AI team for ambitious companies. We design, build and deploy intelligent systems that compound.
                </p>

                <div className="flex flex-col gap-4">
                  {[
                    { icon: Mail, label: 'Email', val: 'karl@kkbglobalsolutions.com' },
                    { icon: Globe, label: 'HQ', val: 'Lisbon (Remote-first)' },
                    { icon: Clock, label: 'Discovery Calls', val: '30-min, Mon-Fri' },
                    { icon: Lock, label: 'Compliance', val: 'SOC 2 / GDPR / EU AI Act' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-4 p-4 rounded transition-all duration-300 hover:translate-x-1 hover:border-cyan-400/40"
                      style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                      <div className="p-2 rounded animate-glow-pulse" style={{ background: 'rgba(0,212,255,0.1)' }}>
                        <item.icon size={16} style={{ color: '#00d4ff' }} />
                      </div>
                      <div>
                        <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.5)' }}>{item.label}</div>
                        <div className="font-rajdhani text-sm font-semibold" style={{ color: '#e0f4ff' }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8"><Waveform bars={35} height={20} /></div>
              </div>
            </RevealWrapper>

            <RevealWrapper direction="right">
              <div className="jarvis-panel corner-bracket p-8 relative">
                <HUDCorner position="tl" /><HUDCorner position="br" />
                <div className="progress-bar mb-6" />
                <div className="font-mono-tech text-xs mb-6" style={{ color: 'rgba(0,212,255,0.4)' }}>// SECURE.TRANSMISSION.FORM</div>

                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse"
                      style={{ background: 'rgba(0,212,255,0.15)', border: '2px solid rgba(0,212,255,0.5)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
                      <CheckCircle size={28} style={{ color: '#00d4ff' }} />
                    </div>
                    <div className="font-orbitron text-lg font-bold mb-3 gradient-cyan glow-cyan">TRANSMISSION RECEIVED</div>
                    <div className="font-rajdhani text-base mb-2" style={{ color: 'rgba(224,244,255,0.6)' }}>
                      Your message has been sent to karl@kkbglobalsolutions.com
                    </div>
                    <div className="font-rajdhani text-sm" style={{ color: 'rgba(224,244,255,0.45)' }}>We'll respond within one business day.</div>
                    <div className="font-mono-tech text-xs mt-4" style={{ color: 'rgba(0,212,255,0.4)' }}>
                      TICKET.ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </div>
                    <button
                      onClick={() => { setFormStatus('idle'); setSubmitted(false); }}
                      className="mt-6 font-mono-tech text-xs underline"
                      style={{ color: 'rgba(0,212,255,0.5)', cursor: 'pointer', background: 'none', border: 'none' }}>
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                      { key: 'email', label: 'Work Email', placeholder: 'your@company.com', type: 'email' },
                      { key: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="font-mono-tech text-xs block mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={e => {
                            setFormData(prev => ({ ...prev, [field.key]: e.target.value }));
                            if (formErrors[field.key]) setFormErrors(prev => { const n = { ...prev }; delete n[field.key]; return n; });
                          }}
                          className="w-full px-4 py-3 rounded font-rajdhani text-sm outline-none transition-all duration-300"
                          style={{
                            background: 'rgba(0,212,255,0.04)',
                            border: `1px solid ${formErrors[field.key] ? 'rgba(255,80,80,0.6)' : 'rgba(0,212,255,0.2)'}`,
                            color: '#e0f4ff',
                          }}
                          onFocus={e => { if (!formErrors[field.key]) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.15)'; } }}
                          onBlur={e => { if (!formErrors[field.key]) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; } }}
                        />
                        {formErrors[field.key] && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <AlertCircle size={11} style={{ color: 'rgba(255,80,80,0.8)', flexShrink: 0 }} />
                            <span className="font-mono-tech text-xs" style={{ color: 'rgba(255,80,80,0.8)' }}>{formErrors[field.key]}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="font-mono-tech text-xs block mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>What are you building?</label>
                      <textarea
                        rows={4}
                        placeholder="Describe your AI problem or initiative..."
                        value={formData.message}
                        onChange={e => {
                          setFormData(prev => ({ ...prev, message: e.target.value }));
                          if (formErrors.message) setFormErrors(prev => { const n = { ...prev }; delete n.message; return n; });
                        }}
                        className="w-full px-4 py-3 rounded font-rajdhani text-sm outline-none transition-all duration-300 resize-none"
                        style={{
                          background: 'rgba(0,212,255,0.04)',
                          border: `1px solid ${formErrors.message ? 'rgba(255,80,80,0.6)' : 'rgba(0,212,255,0.2)'}`,
                          color: '#e0f4ff',
                        }}
                        onFocus={e => { if (!formErrors.message) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.15)'; } }}
                        onBlur={e => { if (!formErrors.message) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; } }}
                      />
                      {formErrors.message && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <AlertCircle size={11} style={{ color: 'rgba(255,80,80,0.8)', flexShrink: 0 }} />
                          <span className="font-mono-tech text-xs" style={{ color: 'rgba(255,80,80,0.8)' }}>{formErrors.message}</span>
                        </div>
                      )}
                    </div>

                    {formStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3 rounded"
                        style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)' }}>
                        <AlertCircle size={14} style={{ color: 'rgba(255,80,80,0.9)', flexShrink: 0 }} />
                        <div>
                          <div className="font-mono-tech text-xs font-bold mb-0.5" style={{ color: 'rgba(255,80,80,0.9)' }}>TRANSMISSION FAILED</div>
                          <div className="font-rajdhani text-xs" style={{ color: 'rgba(255,150,150,0.7)' }}>
                            Could not send your message. Please email us directly at karl@kkbglobalsolutions.com
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="btn-jarvis flex items-center justify-center gap-3 py-4 rounded font-bold transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,153,187,0.15))',
                        border: '1px solid rgba(0,212,255,0.5)',
                        color: '#00d4ff',
                        boxShadow: '0 0 20px rgba(0,212,255,0.15)',
                        fontSize: '0.75rem',
                        cursor: formStatus === 'sending' ? 'not-allowed' : 'pointer',
                        opacity: formStatus === 'sending' ? 0.7 : 1,
                      }}>
                      {formStatus === 'sending' ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                          TRANSMITTING...
                        </>
                      ) : (
                        <><Send size={14} /> TRANSMIT MESSAGE</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ borderTop: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,5,15,0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full animate-arc-rotate" style={{ border: '1px solid rgba(0,212,255,0.5)', borderTopColor: '#00d4ff' }} />
                  <div className="absolute inset-1 rounded-full" style={{ background: 'radial-gradient(circle, #00d4ff, #0099bb, #003344)', boxShadow: '0 0 10px rgba(0,212,255,0.4)' }} />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-sm tracking-widest" style={{ color: '#00d4ff' }}>KKB GLOBAL SOLUTIONS</div>
                  <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>AI ENGINEERING DIVISION</div>
                </div>
              </div>
              <p className="font-rajdhani text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(224,244,255,0.45)' }}>
                The outsourced AI team for ambitious companies. We design, build and deploy intelligent systems that compound.
              </p>
              <div className="mt-4"><Waveform bars={25} height={16} /></div>
            </div>

            <div>
              <div className="font-mono-tech text-xs mb-4 tracking-widest" style={{ color: 'rgba(0,212,255,0.5)' }}>COMPANY</div>
              {['About', 'Work', 'Services'].map(l => (
                <div key={l} className="mb-2">
                  <a href={`#${l.toLowerCase()}`} className="font-rajdhani text-sm transition-all duration-200 hover:text-cyan-400 hover:translate-x-1 inline-block" style={{ color: 'rgba(224,244,255,0.4)' }}>{l}</a>
                </div>
              ))}
            </div>

            <div>
              <div className="font-mono-tech text-xs mb-4 tracking-widest" style={{ color: 'rgba(0,212,255,0.5)' }}>GET IN TOUCH</div>
              <div className="flex flex-col gap-3">
                <a href="#contact" className="font-rajdhani text-sm transition-all duration-200 hover:text-cyan-400" style={{ color: 'rgba(224,244,255,0.4)' }}>Contact</a>
                <a href="#faq" className="font-rajdhani text-sm transition-all duration-200 hover:text-cyan-400" style={{ color: 'rgba(224,244,255,0.4)' }}>FAQ</a>
                <a href="mailto:karl@kkbglobalsolutions.com" className="font-mono-tech text-xs transition-all duration-200 hover:text-cyan-400" style={{ color: 'rgba(0,212,255,0.5)' }}>karl@kkbglobalsolutions.com</a>
                <div className="flex gap-3 mt-2">
                  {[Code2, Terminal, Globe].map((Icon, i) => (
                    <div key={i} className="w-8 h-8 rounded flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:bg-cyan-900/40 hover:border-cyan-400/60"
                      style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Icon size={14} style={{ color: 'rgba(0,212,255,0.6)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
            <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.3)' }}>
              &copy; 2026 KKB Global Solutions. Founded 2026. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00d4ff' }} />
              <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>SYSTEM STATUS: NOMINAL</span>
            </div>
          </div>
        </div>
      </footer>

        </>
      ) : currentPage === 'blog' ? (
        <BlogPage setCurrentPage={setCurrentPage} />
      ) : (
        <CaseStudiesPage setCurrentPage={setCurrentPage} />
      )}


    </div>
  );
}

// ====== BLOG PAGE ======
const ARTICLE_CONTENT: Record<string, string[]> = {
  'llm-production': [
    'Building LLM applications that survive contact with production requires a fundamentally different approach than building prototypes. The gap between a working demo and a reliable product is where most AI projects fail.',
    '## Architect for Observability First',
    'Before writing a single prompt, instrument your application. Every LLM call should log the input, output, latency, token count, and model version. Without this data, debugging production issues becomes guesswork. Tools like LangSmith, Helicone, or a custom OpenTelemetry pipeline all work — the key is consistency.',
    '## Prompt Engineering as Code',
    'Treat prompts as versioned artifacts in your codebase. Use a prompt registry to manage variants, track performance across versions, and roll back safely. Avoid hardcoding prompts in application logic — they will change far more often than your infrastructure.',
    '## Evaluation-Driven Development',
    'Define your success metrics before you write your first prompt. For most LLM tasks, this means a dataset of representative inputs paired with expected outputs or quality rubrics. Run evals on every model change, prompt change, and dependency upgrade. Catching regressions early is ten times cheaper than fixing them in production.',
    '## Graceful Degradation',
    'LLMs fail in ways traditional software does not: hallucinations, refusals, malformed outputs, and timeouts. Design your system to handle each failure mode explicitly. For high-stakes operations, implement a human-in-the-loop fallback rather than trusting the model completely.',
    '## Caching and Cost Control',
    'Semantic caching (caching responses for semantically similar inputs, not just identical ones) can reduce LLM API costs by 40-60% for many applications. Tools like GPTCache make this straightforward. Set per-user and per-request cost budgets at the infrastructure layer, not the application layer.',
    '## Production Monitoring',
    'Monitor for model drift, not just errors. Track output quality metrics over time — if your accuracy rate drops from 94% to 88% over two weeks, you want to know before users complain. Build dashboards that surface quality signals alongside traditional SLOs.',
  ],
  'rag-vs-fine-tuning': [
    'The question "should we RAG this or fine-tune?" comes up in almost every AI project. Both approaches work. The right choice depends on your data, latency requirements, and budget.',
    '## When RAG Wins',
    'RAG is the right default for most knowledge-intensive tasks. If your data changes frequently, RAG lets you update your knowledge base without retraining. If you need source citations for trust and compliance, RAG provides them naturally. If your budget is tight, RAG with a hosted embedding model and a vector database costs a fraction of fine-tuning runs.',
    '## When Fine-Tuning Wins',
    'Fine-tuning outperforms RAG when you need to change the model\'s behavior or style, not just its knowledge. If you need the model to respond in a specific format, adopt a domain-specific vocabulary, or apply consistent reasoning patterns, fine-tuning is the right tool. It also wins on latency — no retrieval step, no context window overhead.',
    '## The Hidden Costs of Fine-Tuning',
    'Fine-tuning requires high-quality labeled data, which is expensive to produce. You also inherit the base model\'s knowledge cutoff, so stale knowledge becomes a permanent problem unless you combine fine-tuning with RAG. Training runs cost money and take time — factor this into your iteration cycle.',
    '## Hybrid Approaches',
    'The most powerful production systems combine both. Fine-tune for style, format, and reasoning patterns. Use RAG for factual grounding and freshness. This combination gives you both the behavioral consistency of fine-tuning and the knowledge freshness of retrieval.',
    '## Decision Framework',
    'Start with RAG. If retrieval quality is good but output quality is not, add fine-tuning. If latency is a problem, consider fine-tuning a smaller model. If your data is too sensitive to send to an API, fine-tune on-premises with an open-weights model.',
  ],
  'mlops-best-practices': [
    'Shipping a model is not the end of the project — it is the beginning. Production ML systems require ongoing monitoring, evaluation, and maintenance. Here is how we approach MLOps at KKB.',
    '## The Eval Stack',
    'Every model we ship has three layers of evaluation: unit evals (test cases for specific behaviors), integration evals (end-to-end tests through the full system), and production evals (sampling real traffic and scoring it offline). Unit evals run in CI. Integration evals run before every deployment. Production evals run continuously.',
    '## Monitoring What Matters',
    'Traditional software monitoring tracks errors and latency. ML systems need more: output quality scores, token costs, retrieval relevance (for RAG systems), and user engagement signals. We use a combination of LLM-as-judge scoring and human review queues to maintain quality visibility.',
    '## Catching Model Drift',
    'Model drift happens when the distribution of real-world inputs shifts away from your training distribution. For LLM applications, this often manifests as increasing refusal rates, decreasing user satisfaction, or rising hallucination rates. Set up automated alerts when these metrics move more than two standard deviations from baseline.',
    '## Cost Optimization',
    'LLM inference costs compound quickly at scale. Audit your token usage monthly. Common wins: caching repeated queries, routing simple queries to cheaper models, batching offline workloads, and reducing context window size through better retrieval. We routinely achieve 40-60% cost reductions without quality impact.',
    '## Deployment Practices',
    'Use canary deployments for model updates — route 5% of traffic to the new model, monitor quality metrics for 24 hours, then roll out fully. Never do a hard cutover. Maintain the ability to roll back to any previous model version in under five minutes.',
  ],
  'autonomous-agents': [
    'Autonomous agents are software systems that perceive their environment, reason about it, and take actions to achieve goals — without step-by-step human instruction. Building them for production requires understanding their unique failure modes.',
    '## The Core Architecture',
    'Every agent needs four components: a perception layer (what inputs can the agent observe?), a reasoning layer (how does the agent decide what to do?), an action layer (what tools can the agent call?), and a memory layer (what state persists across steps?). Getting these four components right determines whether your agent is reliable or unpredictable.',
    '## Tool Design is Everything',
    'The quality of an agent system is largely determined by the quality of its tools. Each tool should do exactly one thing, have unambiguous documentation, return structured outputs, and fail gracefully with informative error messages. Agents with poorly designed tools hallucinate workarounds that cause real damage.',
    '## Reasoning Loops',
    'The ReAct pattern (Reason + Act) is the most reliable reasoning loop for production agents. The agent alternates between reasoning about its current state and taking a single action. This creates a traceable audit trail and makes debugging tractable. Avoid "chain of thought in one shot" for complex tasks — it sacrifices observability.',
    '## Failure Modes and Mitigations',
    'Agents fail in ways that are qualitatively different from traditional software. Common failure modes: infinite loops (add step limits and loop detection), over-confident actions (require confirmation for irreversible operations), prompt injection via tool results (sanitize tool outputs before injecting them into context), and scope creep (define the agent\'s operating scope explicitly and enforce it).',
    '## When Not to Use Agents',
    'Agents add complexity and unpredictability. For deterministic, well-defined tasks, a traditional pipeline is almost always better. Reach for agents when the task requires dynamic reasoning, has too many branches to enumerate statically, or needs to adapt to unexpected inputs.',
  ],
  'llm-scaling': [
    'Serving large language models at scale is one of the most challenging infrastructure problems in modern software. Latency, throughput, and cost are all in tension — here is how we navigate them.',
    '## vLLM: The Standard for Open-Weights Serving',
    'vLLM has become the de facto standard for serving open-weights models. Its PagedAttention mechanism dramatically increases GPU memory efficiency, enabling 2-4x higher throughput than naive serving approaches. For most production deployments with Llama, Mistral, or similar models, vLLM is the right starting point.',
    '## Quantization Strategies',
    'INT8 quantization reduces memory footprint by ~50% with minimal quality degradation for most tasks. INT4 with GPTQ or AWQ reduces it by ~75% with moderate quality loss — acceptable for many applications. FP8 is emerging as the sweet spot for modern GPUs. Always benchmark your specific task before committing to a quantization level.',
    '## Batching and Throughput',
    'Continuous batching (processing requests as they arrive rather than waiting for a full batch) is critical for low-latency serving. vLLM and TGI both support this. Set your max batch size based on your latency SLO — larger batches increase throughput but also increase tail latency.',
    '## Multi-GPU Deployment',
    'Tensor parallelism splits a single model across multiple GPUs, reducing per-GPU memory requirements. Pipeline parallelism splits layers across GPUs, which works well for very large models but adds latency. For most deployments, tensor parallelism with 2-4 GPUs is the practical sweet spot.',
    '## Cost Architecture',
    'On AWS, A100 instances cost roughly $3-4/hour per GPU. Optimize ruthlessly: use spot instances for batch workloads, right-size your GPU count to your actual throughput needs, and implement request queuing to smooth traffic spikes. We routinely achieve 60% cost reductions through systematic optimization.',
  ],
  'eu-ai-act': [
    'The EU AI Act entered into force in August 2024 with a phased implementation timeline. If you are building AI systems that affect EU citizens — regardless of where you are based — compliance is not optional.',
    '## Risk Classification',
    'The Act classifies AI systems into four risk categories. Unacceptable risk systems (social scoring, real-time biometric surveillance in public) are prohibited. High-risk systems (medical devices, critical infrastructure, employment decisions, law enforcement) face strict requirements. Limited risk systems have transparency obligations. Minimal risk systems are largely unregulated.',
    '## High-Risk Requirements',
    'If your system is high-risk, you need: a risk management system, high-quality training data documentation, technical documentation and logging, transparency to users, human oversight mechanisms, accuracy and robustness standards, and cybersecurity measures. These are not checkbox requirements — they require architectural decisions from day one.',
    '## The Technical Documentation Burden',
    'High-risk systems must maintain documentation covering: the system\'s intended purpose, the development process, performance metrics, testing methodology, and known limitations. This documentation must be kept current throughout the system\'s lifecycle. Build documentation generation into your MLOps pipeline rather than treating it as an afterthought.',
    '## General Purpose AI Models',
    'The Act has specific provisions for GPAI (General Purpose AI) models like GPT-4 and Claude. Providers of these models must maintain technical documentation, provide information to downstream deployers, and — for models above a compute threshold — conduct adversarial testing and report serious incidents.',
    '## Building Compliant from Day One',
    'Retrofitting compliance onto a deployed system is expensive and sometimes impossible. The right approach: classify your system\'s risk level before architecture begins, design your data pipeline to support the required documentation, build human oversight hooks into your UI from the start, and instrument your system to generate the required audit logs automatically.',
  ],
  'ai-integration': [
    'Most AI projects are not greenfield. They are additions to existing products — features bolted onto systems that were not designed with AI in mind. This creates unique challenges that pure AI teams often underestimate.',
    '## Start with User Intent, Not Technology',
    'The question is never "where can we add AI?" — it is "what do users struggle with that AI could make easier?" Map your user journey before picking a model. The best AI integrations feel invisible: users accomplish their goals faster, and they may not even notice that AI is involved.',
    '## The Trust Gradient',
    'Users extend trust to AI features gradually. Start with low-stakes, easily reversible features — suggestions, summaries, drafts. Measure acceptance rates and error rates before expanding to higher-stakes features. Never surprise users with AI-driven actions they did not explicitly request.',
    '## Latency and the Perceived Value Threshold',
    'AI features have a latency budget determined by their perceived value. A one-second delay is acceptable for a complex document summary. It is not acceptable for autocomplete. Match your infrastructure choices to your latency budget. If you cannot meet the budget, change the feature design, not just the infrastructure.',
    '## Graceful Degradation at the Product Level',
    'Design every AI feature with a non-AI fallback. If the model is down, slow, or returns low-confidence output, the product should still work. This is both a reliability requirement and a trust signal — users who never see broken AI features are more likely to trust AI features that work.',
    '## Measuring Impact',
    'Define your success metrics before launch. For most AI features, the right metrics are task completion rate, time-on-task, error rate, and user satisfaction — not model accuracy. A 95% accurate model that users do not trust has no business value. A 90% accurate model that users adopt and rely on does.',
  ],
  'multi-agent': [
    'Single agents are powerful. Multi-agent systems — where specialized agents collaborate on complex tasks — can tackle problems that no single agent could handle alone. But the coordination overhead is real.',
    '## When to Go Multi-Agent',
    'Multi-agent architectures make sense when: a task has clearly separable subtasks that can run in parallel, different subtasks require different tools or expertise, a single context window is insufficient for the full task, or you need independent verification of critical outputs. Do not use multi-agent systems just because they sound impressive.',
    '## Orchestration Patterns',
    'The most reliable multi-agent pattern is a central orchestrator with specialized sub-agents. The orchestrator plans the task, routes subtasks to the appropriate agent, aggregates results, and handles failures. Each sub-agent has a narrow, well-defined responsibility. This pattern is easy to debug and easy to extend.',
    '## Avoiding Coordination Failure',
    'Multi-agent systems fail when agents make conflicting assumptions, when message passing introduces ambiguity, or when partial failures cascade. Mitigations: use structured data formats for inter-agent communication, include explicit context in every message (do not rely on shared state), and design each agent to operate correctly even if other agents fail.',
    '## Cost Management',
    'Multi-agent systems multiply your LLM API costs. A naive implementation of a five-agent system might cost 10x more than a single-agent approach for the same task. Optimize by routing simple subtasks to smaller models, caching sub-agent results when subtasks repeat, and measuring cost per unit of output quality — not just cost per task.',
    '## Frameworks and Tooling',
    'LangGraph, AutoGen, and CrewAI all offer multi-agent abstractions. We prefer LangGraph for production systems because its explicit state graph makes the system\'s behavior auditable and testable. AutoGen is excellent for research and prototyping. CrewAI has the friendliest API but less flexibility for complex coordination patterns.',
  ],
  'model-evals': [
    'You cannot improve what you cannot measure. For production AI systems, evals are the measurement layer — the difference between "I think it\'s working" and "I know it\'s working."',
    '## What Evals Are',
    'An eval is a function that takes a model input and output and returns a quality signal. The signal can be binary (correct/incorrect), scalar (1-5 quality score), or structured (a rubric with multiple dimensions). Good evals are fast, cheap, reproducible, and correlated with what users actually care about.',
    '## Building Your Eval Dataset',
    'Start with 50-100 representative examples covering your most common use cases and your known edge cases. Label them carefully — the quality of your eval dataset determines the quality of your feedback signal. Add adversarial examples: inputs designed to expose the model\'s failure modes. Grow the dataset over time as you discover new failure patterns.',
    '## LLM-as-Judge',
    'For tasks where human evaluation is expensive, using a stronger LLM to evaluate a weaker one is surprisingly effective. A GPT-4o judge evaluating GPT-3.5 outputs can catch 70-80% of the errors a human reviewer would catch, at a fraction of the cost. Calibrate your judge by comparing its scores to human scores on a held-out set.',
    '## Regression Testing',
    'Every model update, prompt change, and dependency upgrade should trigger a full eval run. Track your eval scores over time in a dashboard. Set alerts for regressions above a threshold. Treat eval regressions like test failures — they block deployment until resolved.',
    '## The Limits of Automated Evals',
    'Automated evals measure what you thought to measure when you designed them. They will not catch failure modes you did not anticipate. Supplement automated evals with regular human review of random production samples — even a 30-minute weekly review session can surface patterns your evals miss.',
  ],
  'poc-to-prod': [
    'The PoC-to-production gap is where AI projects go to die. We have seen it dozens of times: a prototype impresses stakeholders, the team commits to shipping it, and then six months pass without a production deployment. Here is how we avoid that.',
    '## Why Prototypes Lie',
    'A prototype optimizes for demo success, not production reliability. It uses the best examples, avoids edge cases, and has no error handling. When you move to production, you encounter the full distribution of real-world inputs — and the prototype breaks in ways you never anticipated. The sooner you test on real data, the better.',
    '## The Architecture Decision Log',
    'Every non-obvious architectural decision should be documented with its rationale and the alternatives considered. This is not bureaucracy — it is a forcing function that surfaces assumptions before they become expensive mistakes. Common decisions that bite teams later: model choice, chunking strategy for RAG, latency budget, and failure mode handling.',
    '## Infrastructure Before Features',
    'Before building the second feature, set up your logging, monitoring, and eval pipeline. Teams that skip this always regret it — they end up retrofitting observability onto a system that was not designed for it, which is painful and expensive. We spend the first sprint of every project on infrastructure.',
    '## The Staging Environment',
    'Your staging environment should be identical to production in every way except scale. Run the same model, the same prompts, the same data pipeline. Use anonymized production data for staging tests. Surprises in staging are cheap; surprises in production are expensive.',
    '## Shipping in Weeks, Not Months',
    'Our typical production deployment timeline: Week 1 — infrastructure, evals, and data pipeline. Week 2 — core feature implementation and integration testing. Week 3 — staging deployment, stakeholder review, and edge case hardening. Week 4 — production canary launch and monitoring setup. This works because we make architectural decisions quickly, resist scope creep, and treat the eval pipeline as a first-class deliverable.',
  ],
};

function ArticlePage({ slug, title, category, date, excerpt, onBack }: { slug: string; title: string; category: string; date: string; excerpt: string; onBack: () => void }) {
  const content = ARTICLE_CONTENT[slug] ?? [];
  const readTime = Math.ceil((content.join(' ').split(' ').length) / 200);

  return (
    <div className="min-h-screen" style={{ background: '#050d1a' }}>
      <div className="max-w-3xl mx-auto px-6 py-32">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 mb-10 font-mono-tech text-xs transition-colors hover:text-cyan-300"
          style={{ color: 'rgba(0,212,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronRight size={14} className="rotate-180" /> Back to Blog
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-2 py-1 rounded text-xs font-mono-tech" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>{category}</span>
            <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{date}</span>
            <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{readTime} min read</span>
          </div>

          <h1 className="font-orbitron font-black mb-6 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#e0f4ff' }}>{title}</h1>

          <p className="font-rajdhani text-lg mb-10 leading-relaxed" style={{ color: 'rgba(224,244,255,0.7)', borderLeft: '3px solid rgba(0,212,255,0.4)', paddingLeft: '1.25rem' }}>{excerpt}</p>

          <div className="space-y-6">
            {content.map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h2 key={i} className="font-orbitron font-bold mt-10 mb-3" style={{ fontSize: '1.1rem', color: '#00d4ff' }}>
                    {block.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={i} className="font-rajdhani text-base leading-relaxed" style={{ color: 'rgba(224,244,255,0.75)', lineHeight: '1.75' }}>
                  {block}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="font-rajdhani text-sm mb-4" style={{ color: 'rgba(224,244,255,0.5)' }}>
              Written by the KKB Global Solutions engineering team.
            </p>
            <button
              onClick={onBack}
              className="btn-jarvis px-6 py-2 rounded font-bold inline-flex items-center gap-2 text-sm"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', cursor: 'pointer' }}>
              <ChevronRight size={14} className="rotate-180" /> All articles
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BlogPage({ setCurrentPage }: { setCurrentPage: (p: 'home' | 'blog' | 'case-studies') => void }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const articles = [
    { title: 'Building Production-Ready LLM Applications: A Step-by-Step Guide', slug: 'llm-production', date: '2026-05-20', category: 'LLM Development', excerpt: 'Learn how to architect, deploy, and monitor LLM applications that scale. We cover everything from prompt engineering to evals to production monitoring.' },
    { title: 'When to Use RAG vs. Fine-Tuning for Custom AI Models', slug: 'rag-vs-fine-tuning', date: '2026-05-18', category: 'AI Strategy', excerpt: 'A practical comparison of Retrieval Augmented Generation and fine-tuning. Understand the tradeoffs, costs, and when each approach makes sense.' },
    { title: 'MLOps Best Practices: Monitoring, Evals, and Cost Optimization', slug: 'mlops-best-practices', date: '2026-05-15', category: 'MLOps', excerpt: 'Production AI requires infrastructure. We break down evals, monitoring dashboards, cost tracking, and how to catch model drift before it hurts users.' },
    { title: 'Autonomous Agents: Building AI Systems That Take Action', slug: 'autonomous-agents', date: '2026-05-12', category: 'Agents', excerpt: 'Autonomous agents are reshaping what\'s possible in software. Learn the architecture, tool calling, reasoning loops, and real-world deployment patterns.' },
    { title: 'Scaling LLM Inference: Multi-GPU Deployment, Quantization, and Beyond', slug: 'llm-scaling', date: '2026-05-10', category: 'Infrastructure', excerpt: 'Serving large models at scale requires careful engineering. Explore vLLM, quantization strategies, and how to reduce latency and costs.' },
    { title: 'The EU AI Act and Responsible AI: What Builders Need to Know', slug: 'eu-ai-act', date: '2026-05-08', category: 'Compliance', excerpt: 'The EU AI Act is live. We break down the risk classifications, documentation requirements, and how to build AI systems that comply from day one.' },
    { title: 'Embedding AI into Existing Products: Integration Patterns and Pitfalls', slug: 'ai-integration', date: '2026-05-05', category: 'Product', excerpt: 'Adding AI to an existing product is not just ML. Learn how to integrate without breaking user trust, and how to measure impact.' },
    { title: 'Multi-Agent Systems: Orchestration, Routing, and Real-World Coordination', slug: 'multi-agent', date: '2026-05-01', category: 'Agents', excerpt: 'Single agents are powerful. Multiple agents working together is exponential. Learn coordination patterns, failure handling, and cost management.' },
    { title: 'Why Model Evals Matter: Building Confidence in Production AI Systems', slug: 'model-evals', date: '2026-04-28', category: 'Quality', excerpt: 'Evals are non-negotiable. We cover unit tests for models, tracking metrics over time, and catching regressions before they reach users.' },
    { title: 'From PoC to Production: How We Ship AI Products in Weeks', slug: 'poc-to-prod', date: '2026-04-25', category: 'Engineering', excerpt: 'The gap between prototype and production kills many AI projects. We share the architecture decisions, tooling, and team structures that make it work.' },
  ];

  if (selectedSlug) {
    const article = articles.find(a => a.slug === selectedSlug)!;
    return <ArticlePage {...article} onBack={() => { setSelectedSlug(null); window.scrollTo(0, 0); }} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#050d1a' }}>
      <div className="max-w-6xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <div className="font-mono-tech text-xs tracking-widest mb-4 animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>
            RESOURCES & INSIGHTS
          </div>
          <h1 className="font-orbitron font-black mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#e0f4ff' }}>
            AI ENGINEERING
            <br /><span className="gradient-cyan">BLOG & RESOURCES</span>
          </h1>
          <p className="font-rajdhani text-lg max-w-2xl mx-auto" style={{ color: 'rgba(224,244,255,0.6)' }}>
            In-depth guides, case studies, and technical insights from our team of senior AI engineers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {articles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => { setSelectedSlug(article.slug); window.scrollTo(0, 0); }}
              className="jarvis-panel corner-bracket p-6 rounded hover:border-cyan-400/40 cursor-pointer transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 rounded text-xs font-mono-tech" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  {article.category}
                </span>
                <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{article.date}</span>
              </div>
              <h3 className="font-orbitron font-bold text-base mb-3 group-hover:text-cyan-300 transition-colors" style={{ color: '#e0f4ff' }}>
                {article.title}
              </h3>
              <p className="font-rajdhani text-sm leading-relaxed mb-4" style={{ color: 'rgba(224,244,255,0.6)' }}>
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2" style={{ color: '#00d4ff' }}>
                <span className="font-mono-tech text-xs">Read article</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
            className="btn-jarvis px-8 py-3 rounded font-bold inline-flex items-center gap-2"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', cursor: 'pointer' }}>
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== CASE STUDIES PAGE ======
function CaseStudiesPage({ setCurrentPage }: { setCurrentPage: (p: 'home' | 'blog' | 'case-studies') => void }) {
  const studies = [
    {
      client: 'Northwind Logistics',
      title: 'Autonomous Dispatch Agent Cuts Routing Time by 73%',
      challenge: 'Northwind managed 500+ daily deliveries across metro areas. Manual routing decisions created 3-hour delays during peak hours, costing $200k annually in inefficiencies.',
      solution: 'We built a multi-agent system: a routing optimizer agent, a constraint solver agent, and a communication agent. The system learns from historical delivery data and real-time traffic.',
      results: { metric1: '-73% routing time', metric2: '+$200k annual savings', metric3: '2.3x throughput', metric4: '12-day deployment' },
      tech: 'Agents, Multi-agent orchestration, Real-time data, Custom solvers',
      testimonial: 'KKB shipped our LLM copilot in six weeks. Our internal team would have taken six months — and the result wouldn\'t have been this polished.',
      author: 'Mira Halvorsen, CTO',
    },
    {
      client: 'Lumen Health',
      title: 'Clinical Copilot Summarizing 10k+ Patient Records Daily',
      challenge: 'Doctors spent 2 hours per day summarizing patient history. With 50k patients, this drained resources and increased diagnosis errors due to missed context.',
      solution: 'Built a clinical-grade RAG system with HIPAA compliance. Ingested structured (EHR) and unstructured (notes, images) data. Fine-tuned Claude for medical summarization with safety guardrails.',
      results: { metric1: '10K+ records/day processed', metric2: '-78% physician time', metric3: '+43% diagnosis accuracy', metric4: '8-week deployment' },
      tech: 'RAG, Fine-tuning, HIPAA compliance, Multi-modal data handling',
      testimonial: 'Best AI consultancy we\'ve worked with — and we\'ve tried four. They actually understand MLOps, evals, and the boring stuff that makes things work.',
      author: 'Aiko Tanaka, Head of AI',
    },
    {
      client: 'Vector Capital',
      title: 'Real-time Fraud Detection Serving 40M Inferences per Day',
      challenge: 'Vector processes 50k transactions/hour. Manual fraud detection missed sophisticated attacks. Real-time ML was needed but required sub-100ms latency.',
      solution: 'Built a two-tier system: lightweight feature extraction at edge (100ms SLA), then ensemble ML on backend. Implemented evals against historical fraud patterns, continuous retraining.',
      results: { metric1: '40M inferences/day', metric2: '+94% fraud catch rate', metric3: '<50ms latency', metric4: '16-week deployment' },
      tech: 'ML infrastructure, Real-time serving, Feature stores, Ensemble models',
      testimonial: 'They operate like a senior in-house team, not an agency. Daily standups, eval-driven development, ruthless focus on production quality.',
      author: 'David Okafor, VP Engineering',
    },
    {
      client: 'Helios Retail',
      title: 'End-to-End RPA Pipeline Saving 18,000 Hours Annually',
      challenge: 'Helios processes supplier orders, payments, and fulfillment manually. Operators spent 15 hours daily on repetitive tasks with 12% error rates.',
      solution: 'Designed RPA workflows using n8n + Make.com with AI checkpoints. Integrated OCR for invoice reading, LLM for exception handling. Full audit trail for compliance.',
      results: { metric1: '18K hours saved/year', metric2: '99.2% accuracy', metric3: '$840k annual ROI', metric4: '6-week deployment' },
      tech: 'RPA, Workflow automation, OCR + AI, Compliance logging',
      testimonial: 'The result is both reliable and sophisticated. They shipped while we were still in design phases.',
      author: 'Sarah Chen, Operations Director',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050d1a' }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20">
          <div className="font-mono-tech text-xs tracking-widest mb-4 animate-flicker" style={{ color: 'rgba(0,212,255,0.5)' }}>
            CASE STUDIES
          </div>
          <h1 className="font-orbitron font-black mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#e0f4ff' }}>
            SHIPPED. MEASURED.
            <br /><span className="gradient-cyan">COMPOUNDED.</span>
          </h1>
        </motion.div>

        <div className="grid gap-12">
          {studies.map((study, i) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="jarvis-panel corner-bracket p-8 rounded">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="font-orbitron font-black text-2xl mb-2 gradient-cyan glow-cyan">{study.title}</h2>
                  <div className="font-mono-tech text-sm mb-6" style={{ color: 'rgba(0,212,255,0.5)' }}>{study.client}</div>

                  <div className="mb-6">
                    <h3 className="font-orbitron text-sm font-bold mb-2" style={{ color: '#e0f4ff' }}>CHALLENGE</h3>
                    <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)' }}>{study.challenge}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-orbitron text-sm font-bold mb-2" style={{ color: '#e0f4ff' }}>SOLUTION</h3>
                    <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(224,244,255,0.6)' }}>{study.solution}</p>
                  </div>

                  <div>
                    <h3 className="font-orbitron text-sm font-bold mb-2" style={{ color: '#e0f4ff' }}>TECHNOLOGIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {study.tech.split(', ').map(t => (
                        <span key={t} className="px-2 py-1 rounded text-xs font-mono-tech" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(224,244,255,0.5)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded p-6">
                    <h3 className="font-orbitron text-sm font-bold mb-4" style={{ color: '#00d4ff' }}>RESULTS</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-orbitron text-lg font-bold" style={{ color: '#00d4ff' }}>{study.results.metric1.split(' ')[0]}</div>
                        <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{study.results.metric1.split(' ').slice(1).join(' ')}</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-lg font-bold" style={{ color: '#00d4ff' }}>{study.results.metric2.split(' ')[0]}</div>
                        <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{study.results.metric2.split(' ').slice(1).join(' ')}</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-lg font-bold" style={{ color: '#00d4ff' }}>{study.results.metric3.split(' ')[0]}</div>
                        <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{study.results.metric3.split(' ').slice(1).join(' ')}</div>
                      </div>
                      <div>
                        <div className="font-orbitron text-lg font-bold" style={{ color: '#00d4ff' }}>{study.results.metric4.split('-')[1]?.trim() || study.results.metric4}</div>
                        <div className="font-rajdhani text-xs" style={{ color: 'rgba(224,244,255,0.5)' }}>{study.results.metric4.split('-')[0]}</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-cyan-500/10">
                      <blockquote className="font-rajdhani text-sm italic mb-3" style={{ color: 'rgba(224,244,255,0.7)' }}>
                        "{study.testimonial}"
                      </blockquote>
                      <div className="font-mono-tech text-xs" style={{ color: 'rgba(0,212,255,0.5)' }}>— {study.author}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
            className="btn-jarvis px-8 py-3 rounded font-bold inline-flex items-center gap-2"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', cursor: 'pointer' }}>
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
