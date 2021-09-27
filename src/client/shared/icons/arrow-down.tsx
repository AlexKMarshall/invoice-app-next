type Props = {
  className?: string
}

export function ArrowDown({ className }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 11 7"
      className={className}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="m1 1 4.228 4.228L9.456 1"
      />
    </svg>
  )
}
