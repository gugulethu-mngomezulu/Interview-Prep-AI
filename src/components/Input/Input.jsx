import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <label className='block text-[13px] text-slate-800 mb-2'>{label}</label>

            <div className='input-box relative flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500'>
                <input
                    type={
                        type === "password" ? (showPassword ? "text" : "password") : type
                    }
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-gray-700"
                    value={value}
                    onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='text-amber-500 cursor-pointer ml-2'
                                onClick={() => toggleShowPassword()}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer ml-2'
                                onClick={() => toggleShowPassword()}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Input;