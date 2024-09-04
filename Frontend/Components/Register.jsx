// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorPicker } from 'react-color-picker';
import 'react-color-picker/index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        address: '',
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        logo: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleColorChange = (color, field) => {
        setFormData({ ...formData, [field]: color });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required minLength={3} maxLength={15} />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} minLength={3} maxLength={15} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required minLength={5} maxLength={50} />
                </label>
                <label>
                    Age:
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required min="10" max="115" />
                </label>
                <label>
                    Home Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required minLength={10} maxLength={100} />
                </label>
                <label>
                    Primary Color:
                    <ColorPicker color={formData.primaryColor} onChange={(color) => handleColorChange(color, 'primaryColor')} />
                </label>
                <label>
                    Secondary Color:
                    <ColorPicker color={formData.secondaryColor} onChange={(color) => handleColorChange(color, 'secondaryColor')} />
                </label>
                <label>
                    Logo (URL):
                    <input type="url" name="logo" value={formData.logo} onChange={handleChange} required minLength={10} maxLength={500} />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
