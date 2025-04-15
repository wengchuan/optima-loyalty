"use client"
import { FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function FormInput({ name, label, type, placeholder, icon, onChange, formValue }) {
  const [showPassword, setShowPassword] = useState(false);

  const iconMap = {
    email: <FaEnvelope />,
    password: <FaLock />,
    name: <FaUser />,
    phone: <FaPhone />,
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span className="icon">{iconMap[icon]}</span>
        <input 
          type={name === "password" && showPassword ? "text" : type} 
          placeholder={placeholder} 
          value={formValue}  
          onChange={onChange}
          name={name} 
          required
          style={{ flex: 1, paddingRight: '2.5rem' }}
        />
        {name === "password" && (
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}
