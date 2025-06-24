import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const emptyStudent = { branch: '', degree: '' };
const emptyStaff = { subject: '', designation: '' };
const emptyNonTeaching = { details: '' };

const nameRegex = /^[A-Za-z ]+$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const textRegex = /^[A-Za-z ]+$/;

const PersonalInfoPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        studentDetails: { ...emptyStudent },
        staffDetails: { ...emptyStaff },
        nonTeachingStaffDetails: { ...emptyNonTeaching },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);

    const token = localStorage.getItem('token');

    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get('/api/users/profile', config);
                let firstName = '', lastName = '';
                if (data.name) {
                    const parts = data.name.split(' ');
                    firstName = parts[0] || '';
                    lastName = parts.slice(1).join(' ') || '';
                }
                const isNew = data.name === 'New User' && !data.phone;
                setIsNewUser(isNew);
                setFormData({
                    firstName,
                    lastName,
                    email: data.email || '',
                    phone: data.phone || '',
                    password: '',
                    role: data.role || '',
                    studentDetails: data.studentDetails || { ...emptyStudent },
                    staffDetails: data.staffDetails || { ...emptyStaff },
                    nonTeachingStaffDetails: data.nonTeachingStaffDetails || { ...emptyNonTeaching },
                });
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [config]);

    const onChange = e => {
        const { name, value } = e.target;
        const { studentDetails, staffDetails, nonTeachingStaffDetails } = formData;
        if (name === 'branch' || name === 'degree') {
            setFormData({ ...formData, studentDetails: { ...studentDetails, [name]: value } });
        } else if (name === 'subject' || name === 'designation') {
            setFormData({ ...formData, staffDetails: { ...staffDetails, [name]: value } });
        } else if (name === 'details') {
            setFormData({ ...formData, nonTeachingStaffDetails: { ...nonTeachingStaffDetails, [name]: value } });
        } else if (name === 'role') {
            // Clear irrelevant fields on role change
            setFormData({
                ...formData,
                role: value,
                studentDetails: value === 'student' ? { ...emptyStudent } : { ...emptyStudent },
                staffDetails: value === 'teaching_staff' ? { ...emptyStaff } : { ...emptyStaff },
                nonTeachingStaffDetails: value === 'non_teaching_staff' ? { ...emptyNonTeaching } : { ...emptyNonTeaching },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const { firstName, lastName, email, phone, role, studentDetails, staffDetails, nonTeachingStaffDetails } = formData;
        if (!firstName || !nameRegex.test(firstName)) {
            return 'First name is required and should contain only letters and spaces.';
        }
        if (!lastName || !nameRegex.test(lastName)) {
            return 'Last name is required and should contain only letters and spaces.';
        }
        if (!email || !emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        if (!phone || !phoneRegex.test(phone)) {
            return 'Phone number must be exactly 10 digits.';
        }
        if (!role) {
            return 'Role is mandatory.';
        }
        if (role === 'student') {
            if (!studentDetails.degree || !textRegex.test(studentDetails.degree)) {
                return 'Degree is required and should contain only letters and spaces.';
            }
            if (!studentDetails.branch || !textRegex.test(studentDetails.branch)) {
                return 'Branch is required and should contain only letters and spaces.';
            }
        }
        if (role === 'teaching_staff') {
            if (!staffDetails.subject || !textRegex.test(staffDetails.subject)) {
                return 'Subject is required and should contain only letters and spaces.';
            }
            if (!staffDetails.designation || !textRegex.test(staffDetails.designation)) {
                return 'Designation is required and should contain only letters and spaces.';
            }
        }
        if (role === 'non_teaching_staff') {
            if (!nonTeachingStaffDetails.details || nonTeachingStaffDetails.details.trim().length === 0) {
                return 'Description is required.';
            }
        }
        return '';
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        const { firstName, lastName, email, phone, role, password, studentDetails, staffDetails, nonTeachingStaffDetails } = formData;
        if (isNewUser && !password) {
            setError('Please set a password for your account.');
            return;
        }
        const payload = {
            name: `${firstName} ${lastName}`.trim(),
            email,
            phone,
            role,
            studentDetails,
            staffDetails,
            nonTeachingStaffDetails,
        };
        if (password) {
            payload.password = password;
        }
        try {
            await axios.put('/api/users/profile', payload, config);
            setSuccess('Profile updated successfully!');
            setIsNewUser(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Complete Your Profile</h2>
            {isNewUser && (
                <div className="alert alert-info">
                    <strong>Welcome!</strong> Please complete your profile information and set a password for your account.
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="card card-body">
                <form onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name *</label>
                            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={onChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name *</label>
                            <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={onChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email *</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={onChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Phone Number *</label>
                            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={onChange} required maxLength={10} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            {isNewUser ? 'Set Password *' : 'Set Password'}
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            value={formData.password} 
                            onChange={onChange} 
                            placeholder={isNewUser ? "Enter your password" : "Leave blank to keep current password"}
                            required={isNewUser}
                        />
                        {isNewUser && (
                            <div className="form-text">Please set a secure password for your account.</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role *</label>
                        <select name="role" className="form-control" value={formData.role} onChange={onChange} required>
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="teaching_staff">Teaching Staff</option>
                            <option value="non_teaching_staff">Non-Teaching Staff</option>
                        </select>
                    </div>
                    {formData.role === 'student' && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Degree *</label>
                                <input type="text" name="degree" className="form-control" value={formData.studentDetails.degree} onChange={onChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Branch *</label>
                                <input type="text" name="branch" className="form-control" value={formData.studentDetails.branch} onChange={onChange} required />
                            </div>
                        </div>
                    )}
                    {formData.role === 'teaching_staff' && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Subject *</label>
                                <input type="text" name="subject" className="form-control" value={formData.staffDetails.subject} onChange={onChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Designation *</label>
                                <input type="text" name="designation" className="form-control" value={formData.staffDetails.designation} onChange={onChange} required />
                            </div>
                        </>
                    )}
                    {formData.role === 'non_teaching_staff' && (
                        <div className="mb-3">
                            <label className="form-label">Description *</label>
                            <textarea name="details" className="form-control" value={formData.nonTeachingStaffDetails.details} onChange={onChange} required></textarea>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">
                        {isNewUser ? 'Complete Profile' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfoPage;
