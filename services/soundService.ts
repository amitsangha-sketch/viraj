
// A simple synthesizer for retro game sounds using Web Audio API
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0) => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
};

export const playSound = (type: 'hover' | 'click' | 'shuffle' | 'win' | 'lose' | 'pop') => {
  initAudio();
  if (!audioCtx) return;

  switch (type) {
    case 'hover':
      playTone(400, 'sine', 0.05);
      break;
    case 'click':
      playTone(600, 'square', 0.05);
      break;
    case 'pop':
      playTone(800, 'triangle', 0.1);
      break;
    case 'shuffle':
      // Rattle sound
      for (let i = 0; i < 5; i++) {
        playTone(200 + Math.random() * 200, 'sawtooth', 0.05, i * 0.05);
      }
      break;
    case 'win':
      // Major arpeggio
      playTone(523.25, 'sine', 0.1, 0); // C5
      playTone(659.25, 'sine', 0.1, 0.1); // E5
      playTone(783.99, 'sine', 0.2, 0.2); // G5
      playTone(1046.50, 'square', 0.4, 0.3); // C6
      break;
    case 'lose':
      // Sad descent
      playTone(400, 'sawtooth', 0.2, 0);
      playTone(300, 'sawtooth', 0.4, 0.2);
      break;
  }
};
