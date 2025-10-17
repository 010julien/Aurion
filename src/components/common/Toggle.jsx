const Toggle = ({ enabled, onChange, label, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-aurion focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${enabled ? 'bg-aurion' : 'bg-gray-200 dark:bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={label}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-100 transition-transform duration-150 ease-in-out shadow-sm
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

export default Toggle
