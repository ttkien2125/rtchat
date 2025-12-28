import { useState, useRef } from "react";
import { ImageIcon, SendIcon, XIcon, Mic, Trash2, Square } from "lucide-react";

import { useChatStore } from "../store/useChatStore";

import useAudioRecorder from "../hooks/useAudioRecorder";
import useKeyboardSound from "../hooks/useKeyboardSound";

function MessageInput() {
    const [ text, setText ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);

    const fileInputRef = useRef(null);

    const { isSoundEnabled, sendMessage } = useChatStore();

    const { playRandomKeyStrokeSound } = useKeyboardSound();

    const {
        isRecording,
        recordingTime,
        audioBlob,
        audioURL,
        startRecording,
        stopRecording,
        cancelRecording,
        resetRecording,
    } = useAudioRecorder();

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview && !audioBlob) return;
        if (isSoundEnabled) playRandomKeyStrokeSound();

        let audioBase64 = null;
        if (audioBlob) {
            const reader = new FileReader();
            audioBase64 = await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(audioBlob);
            });
        }

        await sendMessage({
            text: text.trim(),
            image: imagePreview,
            audio: audioBase64,
            audioDuration: recordingTime,
        });

        setText("");
        setImagePreview(null);
        resetRecording();

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const formatRecordingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const hasContent = text.trim() || imagePreview || audioBlob;

    return (
      <div className="p-4 border-t border-slate-700/50">
        {
          imagePreview && (
            <div className="max-w-3xl mx-auto mb-3 flex items-center">
              <div className="relative">
                <img src={imagePreview}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                />
                <button type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        }

        {
          audioURL && !isRecording && (
            <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2">
              <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Mic className="w-5 h-5 text-cyan-500" />
                  <div className="flex-1">
                    <audio src={audioURL} controls className="w-full h-8" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        }

        {
          isRecording && (
            <div className="max-w-3xl mx-auto mb-3">
              <div className="bg-slate-800/50 border border-cyan-500/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-slate-200">Recording...</span>
                  <span className="text-cyan-500 font-mono">
                    {formatRecordingTime(recordingTime)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" fill="white" />
                    Stop
                  </button>
                </div>
              </div>
            </div>
          )
        }

        <form onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto flex space-x-4"
        >
          <input type="text"
            value={text}
            placeholder="Type your message..."
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            disabled={isRecording}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          />

          <input type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {
            !isRecording && !audioBlob && (
              <>
                <button type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""}`}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-slate-800/50 text-slate-400 hover:text-cyan-500 rounded-lg px-4 transition-colors"
                  title="Record audio"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </>
            )
          }

          <button type="submit"
            disabled={!hasContent || isRecording}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
}

export default MessageInput;
