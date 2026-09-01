import { synthesizeSpeech, TTSPayload } from '@/services/tts/ttsService'
import { useMutation } from '@tanstack/react-query'
import {
  useAudioPlayer,
  useAudioPlayerStatus
} from 'expo-audio'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useTTS = () => {
  const mutation = useMutation({
    mutationFn: synthesizeSpeech,
  })

  const [source, setSource] = useState<string | null>(null)
  const isPlayingRef = useRef(false);
  const sourceKeyRef = useRef(0);
  const playerRef = useRef<any>(null);
  const statusRef = useRef<any>(null);

  // Player is recreated when `source` changes
  const player = useAudioPlayer(source, {
    updateInterval: 100,
  })

  // Keep refs updated
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const status = useAudioPlayerStatus(player)
  
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stop = useCallback(async () => {
    try {
      if (playerRef.current) {
        try {
          playerRef.current.pause();
        } catch (e) {
          // Player might not be in a playing state
        }
        try {
          playerRef.current.seekTo(0);
        } catch (e) {
          // Ignore seek errors
        }
      }
      
      // Reset source to null to release the audio
      setSource(null);
      sourceKeyRef.current += 1;
      
      // Reset refs
      isPlayingRef.current = false;
    } catch (error) {
      console.log("Error in stopping audio ", error)
    }
  }, []);

  const speak = useCallback(async (
    payload: TTSPayload,
    options?: {
      shouldPlay?: boolean
    }
  ) => {
    try {
      // Stop any current playback first
      await stop();
      
      // Wait for player to be ready after stop
      await new Promise(resolve => setTimeout(resolve, 200));

      let uri: string;

      // Handle pre-generated audio URL - skip mutation entirely
      if (payload.isUrl) {
        console.log("Using pre-generated audio URL directly:", payload.text);
        uri = payload.text;
      } else {
        // Generate audio using TTS API
        const audioData = await mutation.mutateAsync(payload)

        if (!audioData?.audio) {
          throw new Error('Audio data not found')
        }

        uri = `data:audio/mpeg;base64,${audioData.audio}`
      }

      // Set new source
      setSource(uri);
      
      // Wait for source to be set and player to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Play if shouldPlay is not false
      if (options?.shouldPlay !== false && playerRef.current) {
        try {
          playerRef.current.play();
          isPlayingRef.current = true;
        } catch (error) {
          console.log("Error playing after source change:", error);
        }
      }
      
    } catch (error) {
      console.log("Error in speak:", error);
      throw error;
    }
  }, [stop, mutation]);

  const pause = useCallback(() => {
    try {
      if (status?.isLoaded && status.playing && player) {
        player.pause();
        isPlayingRef.current = false;
      }
    } catch (error) {
      console.log("Error in pausing audio ", error)
    }
  }, [status, player]);

  const resume = useCallback(() => {
    try {
      if (status?.isLoaded && !status.playing && player) {
        player.play();
        isPlayingRef.current = true;
      }
    } catch (error) {
      console.log("Error in resuming audio ", error)
    }
  }, [status, player]);

  // Cleanup on unmount - stop audio completely
  useEffect(() => {
    return () => {
      // Stop the audio player on unmount
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.seekTo(0);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      isPlayingRef.current = false;
      setSource(null);
    };
  }, []);

  // Remote URLs often flip isLoaded / stop buffering before duration metadata is known.
  // AudioStatus.duration stays 0 until length is available — keep UI loading until then.
  const durationSec = status?.duration ?? 0
  const isLoaded = status?.isLoaded ?? false
  const legacyIsLoading = Boolean(
    (status as { isLoading?: boolean } | undefined)?.isLoading,
  )
  const isAudioLoading =
    source != null &&
    (legacyIsLoading ||
      Boolean(status?.isBuffering) ||
      !isLoaded ||
      (isLoaded && durationSec <= 0))

  return {
    speak,
    pause,
    resume,
    stop,
    status,
    player,
    isPending: mutation.isPending,
    isAudioLoading,
    error: mutation.error,
  }
}