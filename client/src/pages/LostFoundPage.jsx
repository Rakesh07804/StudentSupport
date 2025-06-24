import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaPlus, FaSearch, FaImage, FaUpload, FaUser } from 'react-icons/fa';

const LostFoundPage = () => {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
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
        const fetchItems = async () => {
            try {
                const { data } = await axios.get('/api/lostfound', config);
                setItems(data);
                setLoading(false);
            } catch (err) {
                setError('Could not fetch items.');
                setLoading(false);
            }
        };
        fetchItems();
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
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('itemName', itemName);
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

            const { data } = await axios.post('/api/lostfound', formData, uploadConfig);
            setItems([data, ...items]);
            setItemName('');
            setDescription('');
            setImageFile(null);
            setImagePreview('');
            setShowModal(false);
        } catch (err) {
            setError('Failed to create item.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setItemName('');
        setDescription('');
        setImageFile(null);
        setImagePreview('');
        setError('');
    };

    return (
        <div className="container mt-4">
            {/* Header with Post Item Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">
                        <FaSearch className="text-primary me-2" />
                        Lost & Found
                    </h2>
                    <p className="text-muted mb-0">Report lost items or post found items</p>
                </div>
                <button 
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <FaPlus />
                    Post Item
                </button>
            </div>

            {/* Items List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading items...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-5">
                    <FaSearch size={48} className="text-muted mb-3" />
                    <h4 className="text-muted">No items yet</h4>
                    <p className="text-muted">Be the first to post a lost or found item!</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus className="me-2" />
                        Post First Item
                    </button>
                </div>
            ) : (
                <div className="row">
                    {items.map((item) => (
                        <div key={item._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                {item.image && (
                                    <img 
                                        src={item.image} 
                                        alt={item.itemName} 
                                        className="card-img-top"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title mb-1 text-truncate" title={item.itemName}>
                                        {item.itemName}
                                    </h5>
                                    <p className="card-text text-muted small mb-3">
                                        {item.description.length > 100 
                                            ? `${item.description.substring(0, 100)}...` 
                                            : item.description
                                        }
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            <FaUser className="me-1" />
                                            {item.user?.name || 'Unknown'}
                                        </small>
                                        <small className="text-muted">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Posting Item */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <FaSearch className="text-primary me-2" />
                                    Post Lost/Found Item
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
                                            <FaSearch className="me-2" />
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Item Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            placeholder="Enter item name"
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
                                            placeholder="Describe the item in detail..."
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
                                            Upload an image (JPG, PNG, GIF) to help identify the item
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
                                                Submit Item
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

export default LostFoundPage;
