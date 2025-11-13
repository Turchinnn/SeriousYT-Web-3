const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 -z-50 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Smooth gradient background that shifts colors - reduced opacity */}
      <div
        className="absolute inset-0 animate-[gradientShift_15s_ease_infinite] pointer-events-none"
        style={{
          background: `
            linear-gradient(-45deg,
              rgba(51, 115, 234, 0.15),
              rgba(21, 51, 95, 0.15),
              rgba(23, 67, 100, 0.15),
              rgba(24, 72, 100, 0.15)
            )
          `,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Floating blur orbs - reduced opacity */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[100px] animate-float-xy pointer-events-none" style={{ backgroundColor: "rgba(11, 28, 54, 0.08)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] rounded-full blur-[100px] animate-[float-xy_22s_ease-in-out_infinite_reverse] pointer-events-none" style={{ backgroundColor: "rgba(59,130,246,0.08)" }} />
      <div className="absolute top-1/2 left-2/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[100px] animate-[float-xy_25s_ease-in-out_infinite] pointer-events-none" style={{ backgroundColor: "rgba(59,130,246,0.06)" }} />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0.00) 40%, rgba(0,0,0,0.06) 70%, rgba(0,0,0,0.12) 100%)" }} />

      {/* Texture noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 350 350' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
