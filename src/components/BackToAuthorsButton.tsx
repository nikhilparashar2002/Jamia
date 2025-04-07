'use client';

export default function BackToAuthorsButton() {
  return (
    <button 
      onClick={() => window.location.href = '/authors'}
      className="text-blue-600 hover:text-blue-800 block mt-4 w-full"
    >
      ← Back to All Authors
    </button>
  );
}
