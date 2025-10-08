import { useState } from 'react'
import { Checkmark } from './Checkmark'
import { Input } from './ui/input'

export const CopyableSnippet = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <>
      <div className={`w-full max-w-xl`}>
        <div className="relative">
          <Input
            onClick={copyToClipboard}
            id="copy-button"
            type="text"
            className="bg-gray-50 border-gray-300 text-gray-600 w-full font-accent cursor-pointer"
            value={text}
            readOnly
          />
          <button
            onClick={copyToClipboard}
            className={`bg-gray-50 absolute cursor-pointer end-2 top-1/2 -translate-y-1/2 text-gray-500 rounded-md py-1 px-1.5  inline-flex items-center justify-center`}
          >
            {copied ? <Checkmark size={4} /> : <Clipboard />}
          </button>
        </div>
      </div>
    </>
  )
}

const Clipboard = () => {
  return (
    <svg
      className="w-3.5 h-3.5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 20"
    >
      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
    </svg>
  )
}
