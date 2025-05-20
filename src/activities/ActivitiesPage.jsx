import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import "./ActivitiesPage.css";

export default function ActivitiesPage() {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  // Fetch activities
  const {
    data: activities,
    loading: activitiesLoading,
    error: activitiesError
  } = useQuery("/activities", "activities");

  // Mutations for adding and deleting activities
  const { mutate: addActivity, loading: addingActivity } = useMutation(
    "POST",
    "/activities",
    ["activities"]
  );
  const { mutate: deleteActivity, loading: deletingActivity } = useMutation(
    "DELETE",
    "/activities",
    ["activities"]
  );

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await addActivity({ name, description });
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (activityId) => {
    setError(null);
    try {
      await deleteActivity({ id: activityId });
    } catch (err) {
      setError(err.message);
    }
  };

  if (activitiesLoading) return <div>Loading activities...</div>;
  if (activitiesError)
    return <div>Error loading activities: {activitiesError}</div>;

  return (
    <div className="activities-page">
      <h1>Activities</h1>

      {error && <div className="error-message">{error}</div>}

      {token && (
        <form onSubmit={handleSubmit} className="activity-form">
          <h2>Create New Activity</h2>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={addingActivity}>
            {addingActivity ? "Creating..." : "Create Activity"}
          </button>
        </form>
      )}

      <div className="activities-list">
        <h2>All Activities</h2>
        {activities?.map((activity) => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            {token && (
              <button
                onClick={() => handleDelete(activity.id)}
                disabled={deletingActivity}
                className="delete-button">
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
