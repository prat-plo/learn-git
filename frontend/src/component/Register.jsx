import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

  return (
    <div className='container mt-5'>
        <div className='row justify-content-center'>
            <div className='col-md-6'>
                <div className='card'>
                    <div className='card-body'>
                        <h2 className='card-title text-center mb-4'>Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor='username'  className='form-label'>Username</label>
                                <input 
                                    type='text'
                                    className='form-control'
                                    id='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='password'  className='form-label'>Password</label>
                                <input 
                                    type='password'
                                    className='form-control'
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type='submit' className='btn btn-primary w-100'>Register</button>
                        </form>
                        {message && <div className='alert alert-info mt-3'>{message}</div>}
                        <p className='mt-3 text-center'>Already have an account?
                            <Link to='/login'>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register
