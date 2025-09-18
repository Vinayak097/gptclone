import { backend_url } from '@/config';

import axios from 'axios';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User } from '../page';
interface props{
    setShowAuth:Dispatch<SetStateAction<boolean>>
    setUser:Dispatch<SetStateAction<User|null>>
    

}

const Auth = ({setShowAuth,setUser}:props) => {
    
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer:any;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const sendOtp = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.post(`${backend_url}/auth/init_signin`, { email });
      setStep(2);
      
      setResendCooldown(30); // 30s cooldown
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(`${backend_url}/auth/signin`, { email, otp });
      console.log("Login Success:", res.data);
      localStorage.setItem('token' , res.data.token)
      setUser(res.data.user)
      setShowAuth(false)
      
      // redirect or show success
      
    } catch (err) {
        console.log(err , ' error from submit opt')
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    step === 1 ? sendOtp() : submitOtp();
  };

  const handleResend = () => {
    if (resendCooldown === 0) sendOtp();
  };

  return (
    <div className='transition-all duration-300 ease-in-out bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl'>
      <div className='flex flex-col space-y-2'>
        {/* Email input */}
        <input
          type="text"
          className='p-2 rounded-2xl bg-third outline-none appearance-none'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === 2 || loading}
        />

        {/* OTP input */}
        {step === 2 && (
          <input
            type="text"
            className='p-2 mt-2 rounded-2xl bg-third outline-none appearance-none'
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
        )}

        <div className='flex flex-col items-center justify-between text-neutral-400 mt-2'>
          {/* Error message */}
          {error && <p className="text-red-500 mb-2">{error}</p>}

          {/* Main button */}
          <button
            onClick={handleClick}
            disabled={loading}
            className='mt-4 text-neutral-400 p-2 rounded-lg px-8 cursor-pointer bg-secondary flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce inline-block"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-150 inline-block"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-300 inline-block"></span>
              </>
            ) : (
              step === 1 ? "Send OTP" : "Submit OTP"
            )}
          </button>

          {/* Resend OTP */}
          {step === 2 && (
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className={`mt-2 text-sm text-blue-400 underline ${resendCooldown > 0 ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
