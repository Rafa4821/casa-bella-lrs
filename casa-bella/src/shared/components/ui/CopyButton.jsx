import { useState } from 'react';
import { Button } from './Button';

export const CopyButton = ({ text, label = 'Copiar', size = 'sm', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <Button
      variant={copied ? 'success' : 'outline'}
      size={size}
      onClick={handleCopy}
      className={className}
      title={copied ? '¡Copiado!' : `Copiar ${label}`}
    >
      {copied ? '✓ Copiado' : `📋 ${label}`}
    </Button>
  );
};
