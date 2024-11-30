import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import './Register.css'; // Import your CSS file

const Register: Component = () => {
  const navigate = useNavigate();

  const [form, setForm] = createSignal({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
    alamat: '',
  });

  const [errors, setErrors] = createSignal({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
    alamat: '',
  });

  const [otp, setOtp] = createSignal('');
  const [isOtpPopupVisible, setOtpPopupVisible] = createSignal(false);

  const handleChange = (e) => {
    setForm({ ...form(), [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = { ...errors() };
    let isFormValid = true;

    // Validation logic (same as before)
    if (!form().firstname) {
      newErrors.firstname = 'First Name is required';
      isFormValid = false;
    } else if (form().firstname.length < 4) {
      newErrors.firstname = 'FirstName harus mengisi 4 huruf';
      isFormValid = false;
    } else {
      newErrors.firstname = '';
    }
    
    if (!form().lastname) {
      newErrors.lastname = 'Last Name is required';
      isFormValid = false;
    } else if (form().lastname.length < 4) {
      newErrors.lastname = 'LastName harus mengisi 4 huruf';
      isFormValid = false;
    } else {
      newErrors.lastname = '';
    }

    if (!form().username) {
      newErrors.username = 'User Name is required';
      isFormValid = false;
    } else if (form().username.length < 3 || form().username.length > 20) {
      newErrors.username = 'User Name should contain 3-20 characters';
      isFormValid = false;
    } else {
      newErrors.username = '';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!form().email) {
      newErrors.email = 'Email is required';
      isFormValid = false;
    } else if (!emailRegex.test(form().email)) {
      newErrors.email = 'Email must be a valid @gmail.com address';
      isFormValid = false;
    } else {
      newErrors.email = '';
    }    

    if (!form().password) {
      newErrors.password = 'Password is required';
      isFormValid = false;
    } else if (form().password.length < 8 || form().password.length > 20) {
      newErrors.password = 'Password must be between 8-20 characters';
      isFormValid = false;
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(form().password)) {
      newErrors.password = 'Password must include letters, numbers, and symbols';
      isFormValid = false;
    } else {
      newErrors.password = '';
    }
    
    if (!form().gender) {
      newErrors.gender = 'Gender is required';
      isFormValid = false;
    } else {
      newErrors.gender = '';
    }

    if (!form().phone) {
      newErrors.phone = 'Phone Number is required';
      isFormValid = false;
    } else if (!/^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(form().phone)) {
      newErrors.phone = 'Phone number should be a valid Indonesian number starting with +62, 62, or 0';
      isFormValid = false;
    } else {
      newErrors.phone = '';
    }

    if (!form().alamat) {
      newErrors.alamat = 'Alamat is required';
      isFormValid = false;
    } else if (form().alamat.length < 4) {
      newErrors.alamat = 'masukan alamat yang tepat';
      isFormValid = false;
    } else {
      newErrors.alamat = '';
    }
    

    setErrors(newErrors);
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://127.0.0.1:8080/pengguna', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: form().firstname,
            lastname: form().lastname,
            email: form().email,
            gender: form().gender,
            password: form().password,
            phone: form().phone,
            alamat: form().alamat,
          }),
        });

        if (response.ok) {
          alert('Registration successful! Please check your email for verification.');
          setOtpPopupVisible(true); // Show OTP popup
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Something went wrong during registration. Please try again later.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form().email,
          otp: otp(),
        }),
      });

      if (response.ok) {
        alert('OTP verified successfully! You can now log in.');
        setOtpPopupVisible(false); // Hide OTP popup
        navigate('/Login'); // Navigate to the login page after successful OTP verification
      } else {
        const errorData = await response.json();
        alert(`OTP verification failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('Something went wrong during OTP verification. Please try again later.');
    }
  };

  return (
    <div class="container">
      <div class="content">
        <div class="logo">
          <img src="assets/project.png" alt="logo" />Space Program
        </div>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit}>
          {/* Form fields (same as before) */}
          <div class="input__row">
            <div class={`input__group ${errors().firstname ? 'error' : ''}`}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder=" "
                value={form().firstname}
                onInput={handleChange}
              />
              <label for="firstname">First Name</label>
              <span class="error__field">{errors().firstname}</span>
            </div>
            <div class={`input__group ${errors().lastname ? 'error' : ''}`}>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder=" "
                value={form().lastname}
                onInput={handleChange}
              />
              <label for="lastname">Last Name</label>
              <span class="error__field">{errors().lastname}</span>
            </div>
          </div>
          <div class={`input__group ${errors().username ? 'error' : ''}`}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              value={form().username}
              onInput={handleChange}
            />
            <label for="username">User Name</label>
            <span class="error__field">{errors().username}</span>
          </div>
          <div class={`input__group ${errors().email ? 'error' : ''}`}>
            <input
              type="text"
              id="email"
              name="email"
              placeholder=" "
              value={form().email}
              onInput={handleChange}
            />
            <label for="email">Email</label>
            <span class="error__field">{errors().email}</span>
          </div>

          <div class={`input__group ${errors().password ? 'error' : ''}`}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              value={form().password}
              onInput={handleChange}
            />
            <label for="password">Password</label>
            <span class="error__field">{errors().password}</span>
          </div>

          <div class={`input__group ${errors().gender ? 'error' : ''}`}>
            <select
              id="gender"
              name="gender"
              value={form().gender}
              onChange={handleChange}
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <span class="error__field">{errors().gender}</span>
          </div>

          <div class={`input__group ${errors().phone ? 'error' : ''}`}>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder=" "
              value={form().phone}
              onInput={handleChange}
            />
            <label for="phone">Phone Number</label>
            <span class="error__field">{errors().phone}</span>
          </div>

          <div class={`input__group ${errors().alamat ? 'error' : ''}`}>
            <input
              type="text"
              id="alamat"
              name="alamat"
              placeholder=" "
              value={form().alamat}
              onInput={handleChange}
            />
            <label for="alamat">Alamat Anda</label>
            <span class="error__field">{errors().alamat}</span>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
      <div class="image"></div>

      {/* OTP Popup */}
      {isOtpPopupVisible() && (
        <div class="otp-popup">
          <div class="otp-popup-content">
            <h2>Enter OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <div class="input__group">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp()}
                  onInput={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit">Verify OTP</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
