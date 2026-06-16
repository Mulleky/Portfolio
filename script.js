const canvas = document.getElementById("orbital-field");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const ctx = canvas.getContext("2d");
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    particles: [],
    rotation: 0
  };

  const palette = [
    "rgba(110, 167, 160, 0.72)",
    "rgba(199, 122, 63, 0.64)",
    "rgba(242, 239, 232, 0.48)"
  ];

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const count = prefersReducedMotion ? 26 : Math.max(56, Math.floor((state.width * state.height) / 18000));
    state.particles = Array.from({ length: count }, (_, index) => {
      const orbit = 0.18 + Math.random() * 0.54;
      return {
        orbit,
        angle: Math.random() * Math.PI * 2,
        speed: (0.00045 + Math.random() * 0.00075) * (index % 2 ? 1 : -1),
        size: 1 + Math.random() * 2.4,
        color: palette[index % palette.length],
        verticalBias: -0.2 + Math.random() * 0.4
      };
    });
  }

  function drawOrbit(cx, cy, radius, rotate, color, width) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotate);
    ctx.scale(1, 0.38);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, state.width, state.height);
    const cx = state.width * 0.5;
    const cy = state.height * 0.47;
    const base = Math.min(state.width, state.height) * 0.56;

    ctx.fillStyle = "rgba(13, 23, 32, 0.36)";
    ctx.fillRect(0, 0, state.width, state.height);

    drawOrbit(cx, cy, base * 0.92, state.rotation, "rgba(110, 167, 160, 0.18)", 1);
    drawOrbit(cx, cy, base * 0.68, state.rotation + 0.86, "rgba(199, 122, 63, 0.18)", 1);
    drawOrbit(cx, cy, base * 0.42, state.rotation - 0.52, "rgba(242, 239, 232, 0.12)", 1);

    for (const particle of state.particles) {
      if (!prefersReducedMotion) {
        particle.angle += particle.speed;
      }

      const radius = base * particle.orbit;
      const x = cx + Math.cos(particle.angle + state.rotation) * radius;
      const y = cy + Math.sin(particle.angle + state.rotation) * radius * 0.38 + particle.verticalBias * base;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      state.rotation += 0.0009;
      requestAnimationFrame(frame);
    }
  }

  resize();
  window.addEventListener("resize", resize);
  frame();
}
