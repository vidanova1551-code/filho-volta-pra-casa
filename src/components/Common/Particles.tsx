export default function Particles() {
  const particles = Array.from({ length: 28 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[#C89C3D]/60 shadow-[0_0_12px_rgba(200,156,61,0.8)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatParticle ${8 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
}