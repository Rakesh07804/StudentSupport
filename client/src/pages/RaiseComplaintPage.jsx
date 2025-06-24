import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaPlus, FaExclamationCircle, FaUpload } from 'react-icons/fa';

const RaiseComplaintPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Get token from localStorage
    const token = localStorage.getItem('token');

    const config = useMemo(() => ({
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const { data } = await axios.get('/api/complaints', config);
                setComplaints(data);
                setLoading(false);
            } catch (err) {
                setError('Could not fetch complaints.');
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [config]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('description', description);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post('/api/complaints', formData, uploadConfig);
            setComplaints([data, ...complaints]);
            setSubject('');
            setDescription('');
            setImageFile(null);
            setImagePreview('');
            setShowModal(false);
        } catch (err) {
            setError('Failed to create complaint.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSubject('');
        setDescription('');
        setImageFile(null);
        setImagePreview('');
        setError('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'success';
            case 'in_progress': return 'warning';
            case 'pending': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div className="container mt-4">
            {/* Header with Raise Complaint Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">
                        <FaExclamationCircle className="text-primary me-2" />
                        Complaints
                    </h2>
                    <p className="text-muted mb-0">View and manage all complaints</p>
                </div>
                <button 
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <FaPlus />
                    Raise Complaint
                </button>
            </div>

            {/* Complaints List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading complaints...</p>
                </div>
            ) : complaints.length === 0 ? (
                <div className="text-center py-5">
                    <FaExclamationCircle size={48} className="text-muted mb-3" />
                    <h4 className="text-muted">No complaints yet</h4>
                    <p className="text-muted">Be the first to raise a complaint!</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus className="me-2" />
                        Raise First Complaint
                    </button>
                </div>
            ) : (
                <div className="row">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0 text-truncate" title={complaint.subject}>
                                            {complaint.subject}
                                        </h5>
                                        <span className={`badge bg-${getStatusColor(complaint.status || 'pending')}`}>
                                            {complaint.status || 'pending'}
                                        </span>
                                    </div>
                                    <p className="card-text text-muted small mb-3">
                                        {complaint.description.length > 100 
                                            ? `${complaint.description.substring(0, 100)}...` 
                                            : complaint.description
                                        }
                                    </p>
                                    {complaint.image && (
                                        <img 
                                            src={complaint.image} 
                                            alt={complaint.subject} 
                                            className="img-fluid rounded mb-3"
                                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            <strong>{complaint.user?.name}</strong>
                                        </small>
                                        <small className="text-muted">
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Raising Complaint */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <FaExclamationCircle className="text-primary me-2" />
                                    Raise a Complaint
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={closeModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={submitHandler}>
                                <div className="modal-body">
                                    {error && (
                                        <div className="alert alert-danger">
                                            <FaExclamationCircle className="me-2" />
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Subject *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Enter complaint subject"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description *</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your complaint in detail..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload Image (Optional)</label>
                                        <div className="input-group">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                id="imageUpload"
                                            />
                                            <label className="input-group-text" htmlFor="imageUpload">
                                                <FaUpload />
                                            </label>
                                        </div>
                                        <div className="form-text">
                                            Upload an image (JPG, PNG, GIF) to help explain your complaint
                                        </div>
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '200px' }}
                                                />
                                                <button 
                                                    type="button" 
                                                    className="btn btn-sm btn-outline-danger ms-2"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setImagePreview('');
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={closeModal}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus className="me-2" />
                                                Submit Complaint
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {showModal && (
                <div 
                    className="modal-backdrop fade show" 
                    onClick={closeModal}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </div>
    );
};

export default RaiseComplaintPage;
