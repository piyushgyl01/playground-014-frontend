import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  postDestination,
  getDestinationStatus,
} from "../features/destinationSlice";

export default function AddDestination() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addStatus } = useSelector(getDestinationStatus);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    details: {
      duration: "",
      difficulty: "Easy",
      price: "",
    },
    highlights: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("details.")) {
      const detailField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData((prev) => ({
      ...prev,
      highlights: newHighlights,
    }));
  };

  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  const handleRemoveHighlight = (index) => {
    if (formData.highlights.length > 1) {
      setFormData((prev) => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty highlights
    const cleanedFormData = {
      ...formData,
      highlights: formData.highlights.filter(
        (highlight) => highlight.trim() !== ""
      ),
    };

    await dispatch(postDestination(cleanedFormData))
      .unwrap()
      .then(() => {
        setMessage({
          show: true,
          text: "Destination added successfully!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch(() => {
        setMessage({
          show: true,
          text: "Failed to add destination. Please try again.",
          type: "danger",
        });
      });
  };

  return (
    <main className="container my-5">
      <h1>Add New Destination</h1>

      {message.show && (
        <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>
      )}

      <div className="card mb-4 p-2">
        <div className="card-header">New Destination Details</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Duration (days)</label>
              <input
                type="number"
                className="form-control"
                name="details.duration"
                value={formData.details.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Difficulty</label>
              <select
                className="form-control"
                name="details.difficulty"
                value={formData.details.difficulty}
                onChange={handleChange}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="details.price"
                value={formData.details.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Highlights</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={highlight}
                    onChange={(e) =>
                      handleHighlightChange(index, e.target.value)
                    }
                    required
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveHighlight(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={handleAddHighlight}
              >
                Add Highlight
              </button>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addStatus === "loading"}
              >
                {addStatus === "loading" ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Adding...
                  </>
                ) : (
                  "Add Destination"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
                disabled={addStatus === "loading"}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
