import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteDestination,
  fetchDestinations,
  setSearchFilter,
  getDestinationStatus,
  selectFilteredDestinations,
} from "./destinationSlice";
import LoadingUi from "../components/LoadingUi";

export default function DestinationList() {
  //STATES
   const [message, setMessage] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const [deletingId, setDeletingId] = useState(null);
  const searchFilter = useSelector((state) => state.destinations.searchFilter);
 
  //USE DISPATCH FUNCTION
  const dispatch = useDispatch();

  //USE SELECTOR TO GET MEMBERS FROM STORE
  const destinations = useSelector(selectFilteredDestinations);

  //DISPTACHING API CALL
  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);
  const { fetchStatus, deleteStatus } = useSelector(getDestinationStatus);

  //HANDLE DELETE
  useEffect(() => {
    if (deleteStatus === "success") {
      setMessage({
        show: true,
        message: "Destination Deleted Successfully.",
        type: "success",
      });
      
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        setMessage({ show: false, message: "", type: "warning" });
      }, 3000);

      // Clear deletingId
      setDeletingId(null);

      return () => clearTimeout(timer);
    } else if (deleteStatus === "error") {
      setMessage({
        show: true,
        message: "Failed to Delete Destination.",
        type: "warning",
      });
      setDeletingId(null);
    }
}, [deleteStatus, deletingId]);

  //HANDLE DELETE
  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteDestination(id));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value));
  };

  return (
    <>
      <h1>All Destinations</h1> {/* SEARCH FILTER */}
      <div className="row">
        <div className="col-md-12">
          <input
            type="text"
            id="searchInput"
            placeholder="Search destinations..."
            value={searchFilter}
            onChange={handleSearchChange}
            className="form-control my-4"
          />
        </div>
        <div className="col-md-6"></div>
      </div>
      {fetchStatus === "loading" && (
        <div className="row">
          {[...Array(30)].map((item) => (
            <LoadingUi item={item} />
          ))}
        </div>
      )}
      {fetchStatus === "error" && (
        <p>Error occured while fetching the data...</p>
      )}
      {message.show && (
        <div className="row">
          <div className="col-md-12">
            <p
              className={
                message.type === "warning"
                  ? "bg-danger-subtle p-3 rounded"
                  : "bg-success-subtle p-3 rounded"
              }
            >
              {message.message}
            </p>
          </div>
        </div>
      )}
      <div className="row">
        {destinations.map((destination) => (
          <div className="col-md-4" key={destination._id}>
            <div className="card mb-4 p-2">
              <div className="card-header">{destination.name}</div>
              <div className="card-body">
                <p>Country: {destination.country}</p>
                <p>duration: {destination.details.duration}</p>
                <p>difficulty: {destination.details.difficulty}</p>
                <p>price: {destination.details.price}</p>
                <div className="row mb-2">
                  <Link
                    to={`/destination-details/${destination.name}/${destination._id}`}
                    className="card-link btn btn-primary px-4"
                  >
                    See Details
                  </Link>
                </div>
                <div className="row">
                  <button
                    className="card-link btn btn-danger px-4"
                    onClick={() => handleDelete(destination._id)}
                    disabled={deletingId === destination._id}
                  >
                    {deletingId === destination._id ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
