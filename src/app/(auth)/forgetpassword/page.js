"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [id_number, setId_number] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !id_number) {
      alert("Please fill in all the fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${bApp}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, id_number }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        router.push(`/resetpassword?id_number=${id_number}`);
        setId_number(id_number);
      }
    } catch (error) {
      console.error("Failed to verify details", error);
      setError("Failed to verify details");
    }
  };

  return (
    <div className="custom-back">
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100%" }}>
        <form className="col-xl-6 bg-custom-form p-4" onSubmit={handleSubmit}>
          <h3 className="text-center mb-4">Forgot Password</h3>

          <div className="form-group mb-4">
            <label htmlFor="exampleInputEmail1">Email:</label>
            <input
              type="email"
              className="form-control bg-custom-input"
              id="exampleInputEmail1"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputPassword1">ID No:</label>
            <input
              type="text"
              className="form-control bg-custom-input"
              id="exampleInputEmail1"
              placeholder="Enter Your ID No:"
              value={id_number.toUpperCase()}
              onChange={(e) => setId_number(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-5 btn-custom w-100"
            disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"></span>
                Checking...
              </>
            ) : (
              "Verify"
            )}
          </button>

          {error && <p className="mt-3 text-center text-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}
