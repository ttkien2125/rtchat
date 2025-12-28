import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

function AudioPlayer({ audioURL, duration }) {
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ currentTime, setCurrentTime ] = useState(0);
    const [ audioDuration, setAudioDuration ] = useState(duration || 0);

    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setAudioDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * audioDuration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
      <div className="flex items-center gap-3 min-w-[250px]">
        <audio ref={audioRef} src={audioURL} />

        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors flex-shrink-0"
        >
          {
            isPlaying
              ? <Pause className="w-5 h-5 text-white" fill="white" />
              : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          }
        </button>

        <div className="flex-1">
          <div
            className="h-2 bg-slate-700 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs mt-1 opacity-75">
            {formatTime(currentTime)} / {formatTime(audioDuration)}
          </div>
        </div>
      </div>
    );
}

export default AudioPlayer;
