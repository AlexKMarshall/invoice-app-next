type Props = {
  className?: string
}

export function Plus({ className }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 11 11"
      className={className}
    >
      <defs />
      <path
        fill="currentColor"
        d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      />
    </svg>
  )
}
