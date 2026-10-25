import React, { useEffect, useRef, useState } from 'react';

// Keyboard-first command menu (opened with Ctrl/⌘ + K). `commands` is a list of
// { id, label, group, run } objects; the list is filtered as the visitor types.
const PaletteDialog = ({ commands, onClose }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const search = query.trim().toLowerCase();
  const results = commands.filter((c) => `${c.label} ${c.group}`.toLowerCase().includes(search));
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  // Lock page scroll and focus the input while open; restore both on close
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Keep the highlighted option visible when moving with the arrow keys
  useEffect(() => {
    document.getElementById(`palette-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const runCommand = (command) => {
    onClose();
    command.run();
  };

  const handleKeyDown = (e) => {
    // Keep Escape/Tab from also reaching a dialog that may be open underneath (see hooks/useDialog.js)
    if (e.key === 'Escape' || e.key === 'Tab') e.stopPropagation();

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((activeIndex + step + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) runCommand(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the palette
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="glass animate-fade-in-up relative w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 border-b border-stroke px-4">
          <span className="font-mono text-sm text-accent" aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search…"
            className="h-12 flex-1 bg-transparent font-mono text-sm text-text outline-none placeholder:text-muted2 focus-visible:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-options"
            aria-autocomplete="list"
            aria-activedescendant={results.length ? `palette-option-${activeIndex}` : undefined}
          />
          <span className="kbd">Esc</span>
        </div>

        <ul id="palette-options" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-xs text-muted2">No matching commands</li>
          )}
          {results.map((command, i) => (
            <li
              key={command.id}
              id={`palette-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseMove={() => i !== activeIndex && setActive(i)}
              onClick={() => runCommand(command)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[3px] px-3 py-2.5 text-sm ${i === activeIndex ? 'bg-accent/15 text-text' : 'text-muted'}`}
            >
              <span>{command.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted2">{command.group}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-stroke px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted2">
          <span><span className="kbd">↑</span> <span className="kbd">↓</span> Move</span>
          <span><span className="kbd">Enter</span> Select</span>
          <span className="ml-auto">Rahman Shishir</span>
        </div>
      </div>
    </div>
  );
};

// Mounting the dialog only while open gives it fresh state (empty search) each time.
const CommandPalette = ({ open, onClose, commands }) =>
  open ? <PaletteDialog commands={commands} onClose={onClose} /> : null;

export default CommandPalette;
