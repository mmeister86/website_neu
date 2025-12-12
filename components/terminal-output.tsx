import type { OutputLine } from "./terminal"

interface TerminalOutputProps {
  output: OutputLine[]
}

export function TerminalOutput({ output }: TerminalOutputProps) {
  return (
    <div className="space-y-0.5">
      {output.map((line, index) => (
        <OutputLineComponent key={index} line={line} />
      ))}
    </div>
  )
}

function OutputLineComponent({ line }: { line: OutputLine }) {
  switch (line.type) {
    case "command":
      return (
        <div className="flex items-start gap-2">
          <span className="text-terminal-green shrink-0">
            <span className="text-terminal-cyan">matthias</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-terminal-pink">chaos</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-terminal-yellow">~</span>
            <span className="text-muted-foreground">$</span>
          </span>
          <span className="text-foreground">{line.content}</span>
          {line.timestamp && <span className="text-terminal-dim text-xs ml-auto">[{line.timestamp}]</span>}
        </div>
      )
    case "response":
      return <pre className="text-foreground whitespace-pre-wrap font-mono text-sm leading-relaxed">{line.content}</pre>
    case "error":
      return <pre className="text-terminal-pink whitespace-pre-wrap font-mono text-sm">{line.content}</pre>
    case "ascii":
      return (
        <pre className="text-terminal-pink whitespace-pre font-mono text-xs sm:text-sm leading-none">
          {line.content}
        </pre>
      )
    case "system":
      return <pre className="text-terminal-dim whitespace-pre-wrap font-mono text-sm">{line.content}</pre>
    default:
      return null
  }
}
