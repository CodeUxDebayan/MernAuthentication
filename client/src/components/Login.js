import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// import * as yup from 'yup';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
    const navigate = useNavigate();
  
    // eslint-disable-next-line no-unused-vars
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Validate the form data using Yup
      // const validationSchema = yup.object().shape({
      //   email: yup.string().required().email(),
      //   password: yup.string().required().min(6)
      // });
      // try {
      //   await validationSchema.validate({ email, password }, { abortEarly: false });
      // } catch (err) {
      //   const validationErrors = {};
      //   err.inner.forEach(error => {
      //     validationErrors[error.path] = error.message;
      //   });
      //   setErrors(validationErrors);
      //   return;
      // }
      // // Clear any previous errors
      // setErrors({});
  
      // Here you can send the email and password to the server
      axios.post('http://localhost:5000/login', { email, password })
        .then(res => {
      // Verify the token
      try {
        const data = res.data;
       
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error("Invalid email or password");
        // setErrors({ login: '' });
      }});
    };
  
    return (
      <div>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide Password" : "Show Password"}
      </button>
            <br />
            <button type="submit">Login</button>
          </form>
      </div>
    );
  }


export default Login