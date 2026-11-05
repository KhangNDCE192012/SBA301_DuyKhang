import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import accountService from "../services/accountService";

export default function MyProfile() {

    const { user, updateUser } = useAuth();

    const [form, setForm] = useState({
        accountName: user?.accountName || "",
        accountEmail: user?.accountEmail || "",
        accountPassword: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const updated = await accountService.updateProfile(form);

            updateUser(updated);

            setForm({
                accountName: updated.accountName,
                accountEmail: updated.accountEmail,
                accountPassword: ""
            });

            setMessage("Profile updated successfully.");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update profile"
            );

        }
    };

    return (

        <main className="page-container">

            <div className="page-heading">

                <div>
                    <span className="eyebrow">
                        PERSONAL SETTINGS
                    </span>

                    <h1>My Profile</h1>

                    <p className="muted">
                        Update your personal account information.
                    </p>
                </div>

            </div>

            <div className="profile-card">

                <div className="profile-avatar">
                    {user?.accountName?.charAt(0).toUpperCase()}
                </div>

                <h2>{user?.accountName}</h2>

                <span className="status-badge">
                    Staff Account
                </span>

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <input
                        required
                        maxLength={100}
                        value={form.accountName}
                        onChange={e => setForm({
                            ...form,
                            accountName: e.target.value
                        })}
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        required
                        maxLength={70}
                        value={form.accountEmail}
                        onChange={e => setForm({
                            ...form,
                            accountEmail: e.target.value
                        })}
                    />

                    <label>New Password</label>

                    <input
                        type="password"
                        maxLength={70}
                        placeholder="Leave blank to keep current password"
                        value={form.accountPassword}
                        onChange={e => setForm({
                            ...form,
                            accountPassword: e.target.value
                        })}
                    />

                    {message && (
                        <p className="success-text">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary full-width"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </main>
    );
}