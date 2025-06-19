"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const bApp = process.env.NEXT_PUBLIC_API_URL;

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const id_number = searchParams.get("id_number");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${bApp}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
          id_number,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successfully");
        router.push("/login");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-back">
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100%" }}>
        <form className="col-xl-6 bg-custom-form p-4" onSubmit={handleSubmit}>
          <h3 className="text-center mb-4">Reset Password</h3>

          <div className="form-group mb-4">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              className="form-control bg-custom-input"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              className="form-control bg-custom-input"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4 btn-custom w-100"
            disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"></span>
                Verifying...
              </>
            ) : (
              "Change"
            )}
          </button>

          {error && <p className="mt-3 text-center text-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<p className="text-center mt-5">Loading form...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
