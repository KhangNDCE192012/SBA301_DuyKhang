
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getOrchids,
    deleteOrchid,
} from "../services/orchidApi";

export default function ListOfOrchids() {
    const [orchids, setOrchids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load orchids from backend
    useEffect(() => {
        let active = true;

        const loadData = async () => {
            try {
                setLoading(true);
                const response = await getOrchids();

                if (active) {
                    setOrchids(response.data);
                    setError("");
                }
            } catch {
                if (active) {
                    setError("Cannot load orchids from server.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, []);

    // Delete orchid
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this orchid?")) return;

        try {
            await deleteOrchid(id);

            setOrchids((prev) =>
                prev.filter((orchid) => orchid.orchidId !== id)
            );

            setError("");
        } catch {
            setError("Cannot delete orchid.");
        }
    };

    return (
        <div className="collection-page">
            <section className="collection-panel">

                {/* Header */}
                <div className="collection-heading">
                    <div>
                        <h2>Orchid List</h2>
                        <p>Manage your orchid collection</p>
                    </div>

                    <Link
                        to="/orchids/new"
                        className="add-orchid-button"
                    >
                        + Add Orchid
                    </Link>
                </div>

                {/* Error message */}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="collection-empty">
                        Loading orchids...
                    </div>
                ) : (
                    <div className="table-scroll">
                        <table className="orchid-table">
                            <thead>
                            <tr>
                                <th className="orchid-number">No.</th>
                                <th>ORCHID</th>
                                <th>CATEGORY</th>
                                <th>NATURAL</th>
                                <th>ATTRACTIVE</th>
                                <th>ACTIONS</th>
                            </tr>
                            </thead>

                            <tbody>
                            {orchids.map((orchid, index) => (
                                <tr key={orchid.orchidId}>

                                    {/* STT */}
                                    <td className="orchid-number">
                                        {index + 1}
                                    </td>

                                    {/* Image and Name */}
                                    <td>
                                        <div className="orchid-info">
                                            <div className="flower-thumb">
                                                <span>✿</span>

                                                {orchid.orchidURL && (
                                                    <img
                                                        src={orchid.orchidURL}
                                                        alt={orchid.orchidName}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <Link
                                                to={`/orchids/${orchid.orchidId}`}
                                                className="flower-name"
                                            >
                                                {orchid.orchidName}
                                            </Link>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td>
                      <span className="category-chip">
                        {orchid.orchidCategory || "N/A"}
                      </span>
                                    </td>

                                    {/* Natural */}
                                    <td>
                      <span
                          className={`status-pill ${
                              orchid.natural
                                  ? "status-yes"
                                  : "status-no"
                          }`}
                      >
                        {orchid.natural ? "Yes" : "No"}
                      </span>
                                    </td>


                                    {/* Attractive */}
                                    <td>
  <span
      className={`status-pill ${
          orchid.attractive
              ? "status-featured"
              : "status-no"
      }`}
  >
    {orchid.attractive ? "Yes" : "No"}
  </span>
                                    </td>


                                    {/* CRUD Actions */}
                                    <td>
                                        <div className="table-actions">

                                            <Link
                                                to={`/orchids/${orchid.orchidId}`}
                                                className="action-button action-view"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                to={`/orchids/${orchid.orchidId}/edit`}
                                                className="action-button action-edit"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                className="action-button action-delete"
                                                onClick={() =>
                                                    handleDelete(orchid.orchidId)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {orchids.length === 0 && !error && (
                            <div className="collection-empty">
                                No orchids available.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
