import { type RefObject, useCallback, useEffect, useRef } from "react";

const FRAMES_WAITED_FOR_THE_PANEL = 30;

const onceThePanelIsVisible = (panel: HTMLElement | null, act: () => void) => {
  let abandoned = false;
  let framesLeft = FRAMES_WAITED_FOR_THE_PANEL;
  let frame = 0;

  const look = () => {
    if (abandoned || !panel) return;
    if (getComputedStyle(panel).visibility === "visible") {
      act();
      return;
    }
    framesLeft -= 1;
    if (framesLeft > 0) frame = requestAnimationFrame(look);
  };

  frame = requestAnimationFrame(look);
  return () => {
    abandoned = true;
    cancelAnimationFrame(frame);
  };
};

const focusIsStillInside = (panel: HTMLElement | null) => {
  const focused = document.activeElement;
  return (
    focused === null ||
    focused === document.body ||
    panel?.contains(focused) === true
  );
};

const focusTheRequestedRow = (panel: HTMLElement | null, n: number | null) => {
  const row =
    n === null
      ? null
      : panel?.querySelector<HTMLElement>(
          `[data-note-row="${CSS.escape(String(n))}"]`,
        );

  if (!row) {
    panel?.focus();
    return;
  }

  const held = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  row.scrollIntoView({ block: "nearest", behavior: held ? "auto" : "smooth" });
  row.focus({ preventScroll: true });
};

const focusThePageItself = () =>
  document
    .querySelector<HTMLElement>("[data-page]")
    ?.focus({ preventScroll: true });

const returnFocus = ({
  fromTheText,
  marker,
  plaque,
}: {
  fromTheText: boolean;
  marker: HTMLElement | null;
  plaque: HTMLElement | null;
}) => {
  const placed = marker?.isConnected === true ? marker : null;
  const next = fromTheText ? (placed ?? plaque) : (plaque ?? placed);
  if (next) next.focus();
  else focusThePageItself();
};

export const useRememberedFocus = (open: boolean, requested: number | null) => {
  const focusBefore = useRef<HTMLElement | null>(null);
  const rememberFocus = useCallback(() => {
    const focused = document.activeElement;
    focusBefore.current =
      focused instanceof HTMLElement && focused !== document.body
        ? focused
        : null;
  }, []);

  useEffect(() => {
    if (open) rememberFocus();
  }, [open, rememberFocus]);

  useEffect(() => {
    if (requested !== null) rememberFocus();
  }, [requested, rememberFocus]);

  return focusBefore;
};

export const useFocusRestored = ({
  open,
  requested,
  panelRef,
  plaqueRef,
  plaqueVisible,
  focusBefore,
}: {
  open: boolean;
  requested: number | null;
  panelRef: RefObject<HTMLElement | null>;
  plaqueRef: RefObject<HTMLElement | null>;
  plaqueVisible: boolean;
  focusBefore: RefObject<HTMLElement | null>;
}) => {
  const restoring = useRef({ held: false, fromTheText: false });
  useEffect(() => {
    if (open) {
      return onceThePanelIsVisible(panelRef.current, () => {
        focusTheRequestedRow(panelRef.current, requested);
        restoring.current = {
          held: panelRef.current?.contains(document.activeElement) === true,
          fromTheText: requested !== null,
        };
      });
    }

    const { held, fromTheText } = restoring.current;
    if (!held) return;
    restoring.current = { held: false, fromTheText: false };

    if (!focusIsStillInside(panelRef.current)) return;

    returnFocus({
      fromTheText,
      marker: focusBefore.current,
      plaque: plaqueVisible ? plaqueRef.current : null,
    });
  }, [open, requested, panelRef, plaqueRef, plaqueVisible, focusBefore]);
};
