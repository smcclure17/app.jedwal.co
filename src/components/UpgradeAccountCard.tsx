export const PremiumApiCard = ({text}: {text: string}) => {
  return (
    <div
      className={`px-2 bg-green-100 rounded-md py-1 relative overflow-hidden bg-gradient-to-br hover:opacity-90 from-[#005430] to-[#57A773] transition ease-in-out`}
    >
      <a href={`https://jedwal.co/pricing`} target="_blank">
        <div className="flex flex-col overflow-hidden">
          <h5
            className={`text-xl tracking-tight text-gray-800 font-accent text-white`}
          >
            {text}
          </h5>
          <p className="text-xs text-gray-100 py-2">
            Standard accounts are limited to 2 APIs. Upgrade to premium to
            create unlimited APIs.
          </p>
        </div>
      </a>
    </div>
  )
}
