
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrchid } from "../services/orchidApi";

export default function OrchidDetail() {
    const { id } = useParams();

    const [orchid, setOrchid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getOrchid(id)
            .then((response) => {
                if (active) setOrchid(response.data);
            })
            .catch(() => {
                if (active) setError("Orchid not found.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) return <p>Loading...</p>;

    if (error || !orchid) {
        return (
            <div className="alert alert-danger">
                {error || "Orchid not found."}
                <div className="mt-2">
                    <Link to="/">Back to list</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2>{orchid.orchidName}</h2>

                {orchid.orchidURL && (
                    <img
                        src={orchid.orchidURL}
                        alt={orchid.orchidName}
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: "300px" }}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                )}

                <p><b>ID:</b> {orchid.orchidId}</p>
                <p><b>Name:</b> {orchid.orchidName}</p>
                <p><b>Category:</b> {orchid.orchidCategory}</p>
                <p><b>Description:</b> {orchid.orchidDescription}</p>
                <p><b>Natural:</b> {orchid.natural ? "Yes" : "No"}</p>
                <p><b>Attractive:</b> {orchid.attractive ? "Yes" : "No"}</p>

                <Link to="/" className="btn btn-secondary me-2">
                    Back
                </Link>

                <Link
                    to={`/orchids/${orchid.orchidId}/edit`}
                    className="btn btn-warning"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}
