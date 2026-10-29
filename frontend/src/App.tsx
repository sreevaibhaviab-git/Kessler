import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';
const SPOTLIGHT_R = 260;
const NAV_ITEMS = ['Mission', 'Orbit Tracker', 'Collision Risk', 'Simulation', 'About'];
type CursorPos = { x: number; y: number };

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mask, setMask] = useState<string>('none');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (cursorX < -SPOTLIGHT_R || cursorY < -SPOTLIGHT_R) {
      setMask('none');
      return;
    }
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
    const nextMask = `url(${canvas.toDataURL()})`;
    setMask(nextMask);
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} aria-hidden="true" />
      <div className="absolute inset-0 z-30 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url("${image}")`, maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
        aria-hidden="true" />
    </>
  );
}

export default function App() {
  const mouse = useRef<CursorPos>({ x: -999, y: -999 });
  const smooth = useRef<CursorPos>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: -999, y: -999 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Mission');

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (mouse.current.x === -999) smooth.current = { x: event.clientX, y: event.clientY };
      mouse.current = { x: event.clientX, y: event.clientY };
    };
    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat hero-zoom"
          style={{ backgroundImage: `url("${BG_IMAGE_1}")` }} />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="absolute z-50 top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>Enter</span>
            <span className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>KESSLER</span>
          </h1>
        </div>

        <div className="hidden sm:block absolute z-50 bottom-14 left-10 md:left-14 max-w-[260px] hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
          <p className="text-sm text-white/80 leading-relaxed">Thousands of satellites. Millions of possibilities. One mission: protecting the future of Earth's orbit.</p>
        </div>

        <div className="absolute z-50 bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">Explore orbital intelligence, predict space debris collision risks, and discover smarter ways to protect satellites.</p>
          <button type="button" className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30" onClick={() => document.getElementById('coming-soon')?.showPopover()}>
            Enter Mission Control
          </button>
        </div>
      </section>

      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5" aria-label="Main navigation">
        <a href="/" className="flex items-center gap-2" aria-label="Kessler home">
          <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true"><path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" /></svg>
          <span className="text-white text-2xl font-playfair italic">Kessler</span>
        </a>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {NAV_ITEMS.map(item => <button type="button" key={item} onClick={() => setActiveNav(item)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeNav === item ? 'bg-white text-gray-900' : 'text-white/80 hover:bg-white/20 hover:text-white'}`}>{item}</button>)}
        </div>

        <button type="button" className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100" onClick={() => document.getElementById('coming-soon')?.showPopover()}>Launch Console</button>
        <button type="button" className="md:hidden text-white p-2" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}</button>
        {mobileMenuOpen && <div className="absolute top-16 left-4 right-4 md:hidden rounded-2xl bg-black/90 border border-white/20 backdrop-blur-md p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(item => <button type="button" key={item} onClick={() => { setActiveNav(item); setMobileMenuOpen(false); }} className={`text-left rounded-xl px-4 py-3 text-sm ${activeNav === item ? 'bg-white text-black' : 'text-white'}`}>{item}</button>)}
          <button type="button" className="bg-white rounded-xl text-gray-900 px-4 py-3 text-sm font-semibold" onClick={() => { setMobileMenuOpen(false); document.getElementById('coming-soon')?.showPopover(); }}>Launch Console</button>
        </div>}
      </nav>
      <div id="coming-soon" popover="auto" className="m-auto max-w-sm rounded-2xl bg-[#171412] text-white shadow-2xl p-7 border border-white/20 backdrop:bg-black/60">
        <h2 className="font-playfair italic text-3xl mb-2">Coming soon</h2>
        <p className="text-white/70 text-sm leading-relaxed mb-6">Kessler Mission Control is under development. Satellite tracking, collision prediction, and maneuver simulation are coming soon.</p>
        <button className="rounded-full bg-[#e8702a] px-5 py-2.5 text-sm font-semibold" onClick={() => document.getElementById('coming-soon')?.hidePopover()}>Close</button>
      </div>
    </main>
  );
}
