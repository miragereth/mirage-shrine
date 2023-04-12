import React, { useRef, useEffect } from "react"

interface AutoExpandingTextareaProps {
  className?: string
  value: string
  onChange: (value: string) => void
}

export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  className,
  value,
  onChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const resize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px"
      }
    }
    resize()
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ overflow: "hidden", resize: "none" }}
      placeholder={"Predict the future"}
    />
  )
}
