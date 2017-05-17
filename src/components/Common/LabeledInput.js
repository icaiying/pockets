import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import './LabeledInput.css'

export function LabeledInput ({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  value
}) {
  const labelClassName = cn('Label', {
    ['LabelDisabled']: disabled
  })

  return (
    <div className='LabeledInput'>
      <label
        className={labelClassName}
        title={label}
      >
        {label}
      </label>
      <input
        aria-label={label}
        className='Input'
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  )
}
LabeledInput.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any
}

export function InputRow ({ children }) {
  return (
    <div className='InputRow'>
      {children}
    </div>
  )
}