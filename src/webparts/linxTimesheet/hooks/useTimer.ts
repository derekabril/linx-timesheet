import { useState, useRef, useCallback } from "react";

export interface ITimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  startTime: Date | null;
}

export interface IUseTimerReturn extends ITimerState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => ITimerState;
  reset: () => void;
}

export const useTimer = (): IUseTimerReturn => {
  const [state, setState] = useState<ITimerState>({
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    startTime: null,
  });
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setState({
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
      startTime: new Date(),
    });
    intervalRef.current = window.setInterval(() => {
      setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
    }, 1000);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPaused: true, isRunning: false }));
  }, [clearTimer]);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false, isRunning: true }));
    intervalRef.current = window.setInterval(() => {
      setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
    }, 1000);
  }, []);

  const stop = useCallback((): ITimerState => {
    clearTimer();
    const finalState = { ...state };
    setState({
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      startTime: null,
    });
    return finalState;
  }, [state, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState({
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      startTime: null,
    });
  }, [clearTimer]);

  return { ...state, start, pause, resume, stop, reset };
};
