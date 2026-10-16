import confetti from 'canvas-confetti';

export function firePookieConfetti() {
  const count = 60;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FB71A9', '#F43F87', '#C084FC', '#FDA4AF', '#FFF0F5', '#FDE047']
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 45,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 35,
  });
}
