import { type KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { COMMON_MISTAKE_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function MistakeTagInput({ value, onChange, className }: Props) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const suggestions = COMMON_MISTAKE_TAGS.filter(
    (tag) => tag.toLowerCase().includes(input.toLowerCase()) && !value.includes(tag)
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase().replace(/\s+/g, '_');
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
    setShowDropdown(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) addTag(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex min-h-10 flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-sm hover:bg-muted"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder={value.length === 0 ? 'Type or pick a mistake tag…' : ''}
          className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onMouseDown={() => addTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
