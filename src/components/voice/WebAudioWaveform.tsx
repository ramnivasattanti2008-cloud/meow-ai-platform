'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, AlertCircle, ShieldAlert } from 'lucide-react';

interface WebAudioWaveformProps {
  isListening: boolean;
  isAgentSpeaking: boolean;
  onMicPermissionError?: (errMsg: string) => void;
  className?: string;
}

export const WebAudioWaveform: React.FC<WebAudioWaveformProps> = ({
  isListening,
  isAgentSpeaking,
  onMicPermissionError,
  className = '',
}) => {
  const [micBlocked, setMicBlocked] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>(Array(24).fill(8));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function setupMicStream() {
      if (!isListening) {
        cleanupAudioStream();
        setMicBlocked(false);
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMicBlocked(true);
          onMicPermissionError?.('Microphone API is not supported in this browser environment.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Generates 32 bins
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateFrequencyData = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          // Sample 24 balanced points
          const sampled: number[] = [];
          const step = Math.max(1, Math.floor(bufferLength / 24));
          for (let i = 0; i < 24; i++) {
            const raw = dataArray[i * step] || 0;
            // Scale between 8px (min) and 48px (max)
            const height = Math.max(8, Math.min(48, Math.round((raw / 255) * 44 + 8)));
            sampled.push(height);
          }

          setFrequencies(sampled);
          animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
        };

        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
        setMicBlocked(false);
      } catch (err: any) {
        console.warn('Microphone stream access error:', err);
        setMicBlocked(true);
        cleanupAudioStream();
        const msg =
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Microphone permission was denied. Please allow microphone access in your browser.'
            : 'Unable to access your microphone. Please verify hardware permissions.';
        onMicPermissionError?.(msg);
      }
    }

    setupMicStream();

    return () => {
      isCancelled = true;
      cleanupAudioStream();
    };
  }, [isListening]);

  // Synthetic organic cadence while Sara (the agent) is speaking
  useEffect(() => {
    if (!isAgentSpeaking || isListening) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 0.25;
      const synthetic = Array(24)
        .fill(0)
        .map((_, i) => {
          // Harmonic wave equation
          const wave1 = Math.sin(step + i * 0.35);
          const wave2 = Math.cos(step * 0.8 + i * 0.2);
          const normalized = (wave1 + wave2 + 2) / 4; // 0 to 1
          return Math.round(10 + normalized * 32);
        });
      setFrequencies(synthetic);
    }, 50);

    return () => clearInterval(interval);
  }, [isAgentSpeaking, isListening]);

  // Return to idle baseline when nothing is active
  useEffect(() => {
    if (!isListening && !isAgentSpeaking) {
      setFrequencies(Array(24).fill(8));
    }
  }, [isListening, isAgentSpeaking]);

  const cleanupAudioStream = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Audio context may already be closing
      }
      audioContextRef.current = null;
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Waveform Bars Container */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-14 px-4 py-2 rounded-2xl bg-zinc-950/80 border border-white/[0.08] backdrop-blur-xl shadow-glass w-full max-w-md">
        {frequencies.map((height, idx) => {
          // Color dynamically based on state
          const barColor = isListening
            ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
            : isAgentSpeaking
            ? 'bg-gradient-to-t from-violet-600 to-fuchsia-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
            : 'bg-zinc-700/60';

          return (
            <div
              key={idx}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-75 ease-out ${barColor}`}
              style={{
                height: `${height}px`,
                opacity: isListening || isAgentSpeaking ? 0.95 : 0.4,
              }}
            />
          );
        })}
      </div>

      {/* Dynamic Status / Diagnostic Pills */}
      {micBlocked && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Mic Blocked:</strong> Click the lock icon in your browser address bar to allow microphone access, or type your message in the chat box.
          </span>
        </div>
      )}

      {!micBlocked && isListening && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Web Audio Analyser Active (Speaking Detection)</span>
        </div>
      )}

      {!micBlocked && isAgentSpeaking && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-violet-400">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span>Sara Speech Stream Active (Synthesizing Audio)</span>
        </div>
      )}
    </div>
  );
};
