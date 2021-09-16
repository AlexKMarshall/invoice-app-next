type Props = {
  className?: string
}
export function ArrowLeft({ className }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 10"
      className={className}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="M6.342.886 2.114 5.114l4.228 4.228"
      />
    </svg>
  )
}
