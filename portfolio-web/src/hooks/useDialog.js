import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared behaviour for modal dialogs (project and blog post modals):
 * - locks page scroll and moves focus into the dialog (to `initialFocusRef`, e.g. the close button)
 * - keeps Tab / Shift+Tab inside the dialog and closes it on Escape
 * - restores the previous scroll setting and focus when it closes
 */
export const useDialog = (dialogRef, onClose, { enabled = true, initialFocusRef } = {}) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    (initialFocusRef?.current ?? dialogRef.current)?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      const dialog = dialogRef.current;
      if (e.key !== 'Tab' || !dialog) return;

      const focusable = [...dialog.querySelectorAll(FOCUSABLE)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusOutside = !dialog.contains(document.activeElement);

      // Wrap around at either end so focus never reaches the page behind the dialog
      if (e.shiftKey && (document.activeElement === first || focusOutside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || focusOutside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [enabled, onClose, dialogRef, initialFocusRef]);
};
