import { createSignal } from 'solid-js';
import './OTPVerification.css'; // Add styling for the popup

const OTPVerificationPopup = ({ onVerify, onCancel }) => {
  const [otp, setOtp] = createSignal('');

  const handleVerify = () => {
    if (otp()) {
      onVerify(otp());
    } else {
      alert('Please enter the OTP');
    }
  };

  return (
    <div class="otp-popup">
      <div class="otp-popup-content">
        <h3>Verify OTP</h3>
        <label>
          Enter OTP:
          <input
            type="text"
            value={otp()}
            onInput={(e) => setOtp(e.target.value)}
          />
        </label>
        <button class="verify-button" onClick={handleVerify}>
          Verify
        </button>
        <button class="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationPopup;
