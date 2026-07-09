import { useEffect, useRef, useState, useCallback } from "react";

const useAudioPlayer = (src: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const slide = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }, []);

    useEffect(() => {
        if (!src || src.length < 1) return
        const audio = new Audio(src);
        audioRef.current = audio;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handlePause = () => {
            setIsPlaying(false);
            if (audio.currentTime === audio.duration) {
                audio.currentTime = 0;
            }
            if (audio.currentTime === 0) {
                setCurrentTime(Math.floor(audio.duration));
            }
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("pause", handlePause);

        return () => {
            setIsPlaying(false)
            audio.pause()
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.onpause = null;
            audio.ontimeupdate = null;
        };
    }, [src]);

    return {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        slide,
    };
};

export default useAudioPlayer;