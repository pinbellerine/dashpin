import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [showForgotPassword, setShowForgotPassword] = createSignal(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = createSignal('');
  const [forgotPasswordError, setForgotPasswordError] = createSignal('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = createSignal('');
  const [forgotPasswordToken, setForgotPasswordToken] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    } else if (id === 'forgotPasswordEmail') {
      setForgotPasswordEmail(value);
    } else if (id === 'forgotPasswordToken') {
      setForgotPasswordToken(value);
    } else if (id === 'newPassword') {
      setNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email(),
          password: password(),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Make sure to use the correct key for the token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user details
        
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Unable to connect to the server. Please try again later.');
    }
  };    
  

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordEmail(),
          token: forgotPasswordToken(),
          new_password: newPassword(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setForgotPasswordMessage('Password updated successfully.');
        setForgotPasswordError('');
      } else {
        const errorData = await response.json();
        setForgotPasswordError(errorData.message || 'Failed to update password.');
        setForgotPasswordMessage('');
      }
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setForgotPasswordError('Unable to connect to the server. Please try again later.');
      setForgotPasswordMessage('');
    }
  };

  return (
    <div class={styles.container}>
      <div class={styles.container__left}>
        <h2>Daftarkan anak anda di sini</h2>
        <p>
          Erdum et malesuada fames ac ante ipsum primis in faucibus uspendisse
          porta.
        </p>
      </div>
      <div class={styles.container__right}>
        <div class={styles.content}>
          <img class={styles.logo} src="assets/project.png" alt="logo" />
          <p class={styles.header}>Selamat datang</p>
          <form onSubmit={handleSubmit}>
            <div class={styles.input__group}>
              <input
                type="text"
                id="email"
                placeholder="Email"
                value={email()}
                onInput={handleInputChange}
              />
            </div>
            <div class={styles.input__group}>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password()}
                onInput={handleInputChange}
              />
            </div>
            {error() && <p class={styles.error}>{error()}</p>}
            
            <p>
              <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
            </p>
            <button type="submit">Sign In</button>
          </form>
          <div class={styles.divider}>
            <span>or</span>
          </div>
          <div class={styles.google__login}>
            <img src="assets/search.png" alt="google" />
            <span>Sign in with Google</span>
          </div>
          <p class={styles.create__account}>
            Tidak punya akun? <a href="/Register">Create Account</a>
          </p>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPassword() && (
        <div class={styles.popup}>
          <div class={styles.popup__content}>
            <span class={styles.popup__close} onClick={() => setShowForgotPassword(false)}>&times;</span>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div class={styles.input__group}>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail()}
                  onInput={handleInputChange}
                  required
                />
              </div>
              <div class={styles.input__group}>
                <input
                  type="text"
                  id="forgotPasswordToken"
                  placeholder="Enter your OTP token"
                  value={forgotPasswordToken()}
                  onInput={handleInputChange}
                  required
                />
              </div>
              <div class={styles.input__group}>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword()}
                  onInput={handleInputChange}
                  required
                />
              </div>
              {forgotPasswordError() && <p class={styles.error}>{forgotPasswordError()}</p>}
              {forgotPasswordMessage() && <p class={styles.success}>{forgotPasswordMessage()}</p>}
              <button type="submit">Send Reset Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
