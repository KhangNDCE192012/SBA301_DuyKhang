
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getOrchid,
    createOrchid,
    updateOrchid,
} from "../services/orchidApi";

const emptyForm = {
    orchidName: "",
    natural: false,
    orchidDescription: "",
    orchidCategory: "",
    attractive: false,
    orchidURL: "",
};

export default function EditOrchid() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        let active = true;

        getOrchid(id)
            .then((response) => {
                if (!active) return;

                const orchid = response.data;

                setForm({
                    orchidName: orchid.orchidName,
                    natural: orchid.natural,
                    orchidDescription: orchid.orchidDescription ?? "",
                    orchidCategory: orchid.orchidCategory ?? "",
                    attractive: orchid.attractive,
                    orchidURL: orchid.orchidURL ?? "",
                });
            })
            .catch(() => {
                if (active) setError("Cannot load orchid.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (isEdit) {
                await updateOrchid(id, form);
            } else {
                await createOrchid(form);
            }

            navigate("/");
        } catch {
            setError("Cannot save orchid.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2 className="mb-4">
                    {isEdit ? "Edit Orchid" : "Create Orchid"}
                </h2>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Orchid Name</label>
                        <input
                            className="form-control"
                            name="orchidName"
                            value={form.orchidName}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input
                            className="form-control"
                            name="orchidCategory"
                            value={form.orchidCategory}
                            onChange={handleChange}
                            maxLength={100}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="orchidDescription"
                            value={form.orchidDescription}
                            onChange={handleChange}
                            maxLength={500}
                            rows="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                            className="form-control"
                            name="orchidURL"
                            value={form.orchidURL}
                            onChange={handleChange}
                            maxLength={500}
                        />
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="natural"
                            name="natural"
                            checked={form.natural}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="natural">
                            Natural Orchid
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="attractive"
                            name="attractive"
                            checked={form.attractive}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="attractive">
                            Attractive
                        </label>
                    </div>

                    <button
                        className="btn btn-success me-2"
                        disabled={saving}
                        type="submit"
                    >
                        {saving ? "Saving..." : "Save Orchid"}
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
