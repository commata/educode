import Editor from '@monaco-editor/react';
import type { EditorLanguage } from '@/shared/constants/languages';

interface MonacoCodeEditorProps {
  language: EditorLanguage;
  value: string;
  onChange: (value: string) => void;
}

export function MonacoCodeEditor({
  language,
  value,
  onChange,
}: MonacoCodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Editor
        height="48vh"
        language={language === 'cpp' ? 'cpp' : language}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        theme="vs-light"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  );
}
