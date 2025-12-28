import { useState, useRef, useCallback } from "react";

import toast from "react-hot-toast";

const useAudioRecorder = () => {
    const [ isRecording, setIsRecording ] = useState(false);
    const [ recordingTime, setRecordingTime ] = useState(0);
    const [ audioBlob, setAudioBlob ] = useState(null);
    const [ audioURL, setAudioURL ] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioURL(url);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("Could not access microphone. Please check permissions.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();

            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setIsRecording(false);
        setRecordingTime(0);
        setAudioBlob(null);
        setAudioURL(null);
        chunksRef.current = [];
    }, []);

    const resetRecording = useCallback(() => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        setAudioBlob(null);
        setAudioURL(null);
        setRecordingTime(0);
    }, [audioURL]);

    return {
        isRecording,
        recordingTime,
        audioBlob,
        audioURL,
        startRecording,
        stopRecording,
        cancelRecording,
        resetRecording,
    };
};

export default useAudioRecorder;
