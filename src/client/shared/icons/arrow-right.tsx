type Props = {
  className?: string
}

export function ArrowRight({ className }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 10"
      className={className}
    >
      <defs />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="M1 1l4 4-4 4"
      />
    </svg>
  )
}
