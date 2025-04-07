import { useEffect, useState } from 'react';
import { diffWords, Change } from 'diff';

interface VersionDiffProps {
  oldContent: string;
  newContent: string;
}

interface DiffResult extends Change {
  value: string;
  added: boolean;
  removed: boolean;
}

export default function VersionDiff({ oldContent, newContent }: VersionDiffProps) {
  const [diffs, setDiffs] = useState<DiffResult[]>([]);

  useEffect(() => {
    const differences = diffWords(oldContent, newContent);
    setDiffs(differences);
  }, [oldContent, newContent]);

  return (
    <div className="version-diff-container p-4 border rounded-lg">
      {diffs.map((part, index) => (
        <span
          key={index}
          className={`${part.added ? 'bg-green-100' : part.removed ? 'bg-red-100' : ''} ${part.removed ? 'line-through' : ''}`}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}