import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
 fetchDestinationById,
 getDestinationById,
 getDestinationStatus,
 updateDestination
} from "../features/destinationSlice";
import DetailsLoading from "../components/DetailsLoading";

export default function DestinationDetails() {
 const navigate = useNavigate();
 const { destinationId } = useParams();
 const dispatch = useDispatch();
 const destination = useSelector(getDestinationById);
 const { fetchByIdStatus, updateStatus } = useSelector(getDestinationStatus);
 const [isEditing, setIsEditing] = useState(false);
 const [message, setMessage] = useState({ show: false, text: "", type: "" });
 const [formData, setFormData] = useState({
   name: "",
   country: "",
   description: "",
   details: {
     duration: "",
     difficulty: "",
     price: "",
   },
   highlights: [],
 });

 useEffect(() => {
   dispatch(fetchDestinationById(destinationId));
 }, [dispatch, destinationId]);

 useEffect(() => {
   if (destination) {
     setFormData({
       name: destination.name || "",
       country: destination.country || "",
       description: destination.description || "",
       details: {
         duration: destination.details?.duration || "",
         difficulty: destination.details?.difficulty || "",
         price: destination.details?.price || "",
       },
       highlights: destination.highlights || [],
     });
   }
 }, [destination]);

 useEffect(() => {
    if (updateStatus === "success") {
      // Refetch the destination data
      dispatch(fetchDestinationById(destinationId));
      
      setMessage({
        show: true,
        text: "Destination updated successfully!",
        type: "success"
      });
      
      // Close edit mode
      setIsEditing(false);
  
      const timer = setTimeout(() => {
        setMessage({ show: false, text: "", type: "" });
      }, 3000);
  
      return () => clearTimeout(timer);
    } else if (updateStatus === "error") {
      setMessage({
        show: true,
        text: "Failed to update destination. Please try again.",
        type: "danger"
      });
    }
  }, [updateStatus, dispatch, destinationId]);
  

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
   setFormData((prev) => ({
     ...prev,
     highlights: prev.highlights.filter((_, i) => i !== index),
   }));
 };

 const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateDestination({ formData, destinationId }));
    // Remove the immediate setIsEditing(false) since we'll do it in the effect
  };
  

 return (
   <>
     {fetchByIdStatus === "loading" ? (
       <DetailsLoading />
     ) : (
       <main className="container my-5">
         {message.show && (
           <div className={`alert alert-${message.type} mb-3`}>
             {message.text}
           </div>
         )}

         <h1>Details of {destination?.name}</h1>

         {isEditing ? (
           <div className="card mb-4 p-2">
             <div className="card-header">Edit Destination</div>
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
                   />
                 </div>

                 <div className="mb-3">
                   <label className="form-label">Difficulty</label>
                   <select
                     className="form-control"
                     name="details.difficulty"
                     value={formData.details.difficulty}
                     onChange={handleChange}
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
                   />
                 </div>

                 <div className="mb-3">
                   <label className="form-label">Description</label>
                   <textarea
                     className="form-control"
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
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
                       />
                       <button
                         type="button"
                         className="btn btn-danger"
                         onClick={() => handleRemoveHighlight(index)}
                       >
                         Remove
                       </button>
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
                     disabled={updateStatus === "loading"}
                   >
                     {updateStatus === "loading" ? (
                       <>
                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                         Saving...
                       </>
                     ) : (
                       "Save Changes"
                     )}
                   </button>
                   <button 
                     type="button" 
                     className="btn btn-secondary"
                     onClick={() => setIsEditing(false)}
                     disabled={updateStatus === "loading"}
                   >
                     Cancel
                   </button>
                 </div>
               </form>
             </div>
           </div>
         ) : (
           <div className="card mb-4 p-2">
             <div className="card-header">{destination?.name}</div>
             <div className="card-body">
               <p>Country: {destination?.country}</p>
               <p>Duration: {destination?.details.duration} days</p>
               <p>Difficulty: {destination?.details.difficulty}</p>
               <p>Price: ${destination?.details.price}</p>
               <p>Description: {destination?.description}</p>
               <div className="mb-3">
                 <h6>Highlights:</h6>
                 <ul>
                   {destination?.highlights.map((highlight, index) => (
                     <li key={index}>{highlight}</li>
                   ))}
                 </ul>
               </div>
               <div className="row mb-2">
                 <button
                   className="card-link btn btn-primary px-4"
                   onClick={() => setIsEditing(true)}
                 >
                   Edit Details
                 </button>
               </div>
             </div>
           </div>
         )}
       </main>
     )}
   </>
 );
}