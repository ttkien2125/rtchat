const keyStrokeSounds = [
  "/sounds/keystroke1.mp3",
  "/sounds/keystroke2.mp3",
  "/sounds/keystroke3.mp3",
  "/sounds/keystroke4.mp3",
].map(path => new Audio(path));

export default function useKeyboardSound() {
    const playRandomKeyStrokeSound = () => {
        const randomSound =
            keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

        randomSound.currentTime = 0;
        randomSound.play().catch(error => console.error("Audio play failed:", error));
    };

    return { playRandomKeyStrokeSound };
}
