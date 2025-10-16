const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
