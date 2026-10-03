import confetti from 'canvas-confetti';

export const triggerStudyConfetti = (originY = 0.6) => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: originY },
      colors: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B'],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore if canvas is unsupported
  }
};

export const triggerBigCelebration = () => {
  try {
    const count = 150;
    const defaults = {
      origin: { y: 0.7 },
      disableForReducedMotion: true,
    };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#10B981', '#34D399', '#059669'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#6366F1', '#818CF8', '#A5B4FC'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // Ignore if canvas is unsupported
  }
};
