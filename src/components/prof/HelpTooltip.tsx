import { useState } from 'react';

/**
 * Ícone de dúvida (?) com tooltip ao passar o mouse.
 * Uso: <HelpTooltip text="Explicação clara para o professor." />
 */
export function HelpTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-2" style={{ verticalAlign: 'middle' }}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#1e40af', color: '#fff',
          border: 'none', cursor: 'help',
          fontSize: 13, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label="Ajuda"
      >
        ?
      </button>
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)',
            background: '#1e293b', color: '#fff',
            padding: '8px 12px', borderRadius: 6,
            fontSize: 13, lineHeight: 1.5,
            whiteSpace: 'pre-wrap', maxWidth: 280,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999, pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
