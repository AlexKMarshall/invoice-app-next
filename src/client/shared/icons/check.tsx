type Props = {
  className?: string
}

export function Check({ className }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 8"
      className={className}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="m1.5 4.5 2.124 2.124L8.97 1.28"
      />
    </svg>
  )
}
