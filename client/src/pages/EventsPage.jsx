// src/pages/EventsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaUpload, FaTimes } from 'react-icons/fa';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token || localStorage.getItem('token');

  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events', config);
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch events.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, [config]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPosterFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPosterPreview('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (posterFile) formData.append('poster', posterFile);
      formData.append('date', date);
      formData.append('venue', venue);
      const uploadConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/events', formData, uploadConfig);
      setEvents([data, ...events]);
      setTitle('');
      setDescription('');
      setPosterFile(null);
      setPosterPreview('');
      setDate('');
      setVenue('');
      setShowModal(false);
    } catch (err) {
      setError('Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle('');
    setDescription('');
    setPosterFile(null);
    setPosterPreview('');
    setDate('');
    setVenue('');
    setError('');
  };

  return (
    <div className="container mt-4">
      {/* Header with Post Event Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <FaCalendarAlt className="text-primary me-2" />
            Events
          </h2>
          <p className="text-muted mb-0">View and post upcoming events</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Post Event
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <FaCalendarAlt size={48} className="text-muted mb-3" />
          <h4 className="text-muted">No events yet</h4>
          <p className="text-muted">Be the first to post an event!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="me-2" />
            Post First Event
          </button>
        </div>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                {event.poster && (
                  <img
                    src={event.poster}
                    className="card-img-top"
                    alt={event.title}
                    style={{ maxHeight: '180px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title mb-1 text-truncate" title={event.title}>{event.title}</h5>
                  <p className="card-text text-muted small mb-2">
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </p>
                  <div className="d-flex align-items-center mb-2">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    <span className="me-3">{new Date(event.date).toLocaleDateString()}</span>
                    <FaMapMarkerAlt className="me-2 text-secondary" />
                    <span>{event.venue}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <small className="text-muted">
                    Posted by: {event.user?.name || 'Unknown'}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Posting Event */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaCalendarAlt className="text-primary me-2" />
                  Post an Event
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the event..."
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload Poster *</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="posterUpload"
                        required
                      />
                      <label className="input-group-text" htmlFor="posterUpload">
                        <FaUpload />
                      </label>
                    </div>
                    <div className="form-text">
                      Upload an image (JPG, PNG, GIF) as the event poster
                    </div>
                    {posterPreview && (
                      <div className="mt-2">
                        <img
                          src={posterPreview}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => {
                            setPosterFile(null);
                            setPosterPreview('');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Venue *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                      />
                    </div>
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
                        Submit Event
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

export default EventsPage;
