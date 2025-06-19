"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import AdminSideBar from "../../adminsidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;
const GenerateReceipt = () => {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [selectedSession, setSelectedSession] = useState("2024/2025");
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };
  useEffect(() => {
    if (!user && !pageloading) {
      router.push("/login");
    }
  }, [user, pageloading, router]);

  if (pageloading || !user)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const handleSessionChange = (e) => setSelectedSession(e.target.value);
  const handleTermChange = (e) => setSelectedTerm(e.target.value);

  const adminId = user.id;

  const fetchReceipt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fetchData = await fetch(
        `${bApp}/api/generate_receipt?adminId=${adminId}&term=${selectedTerm}&session=${selectedSession}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await fetchData.json();
      // console.log("The data from backend:", data);

      if (!fetchData.ok) {
        setError("No record found ");
      }

      if (fetchData.ok) {
        setReceipts(data);
      }
    } catch (error) {
      console.error("Unable href fetch receipt", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${bApp}/api/receipt/search?identitynumber=${identityNumber}&term=${selectedTerm}&session=${selectedSession}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("No record found for this ID");
      }
      const data = await response.json();
      // console.log("The response from backend", data);
      setReceipts(data || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setSearchLoading(false);
    }
  };
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${bApp}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // sends the cookie
      });

      if (response.ok) {
        alert("Logged out successfully");
        setUser(null);
        localStorage.removeItem("userInfo");
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  if (pageloading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <div className="d-flex topdiv vh-100">
        {sidebarVisible && <AdminSideBar />}

        <div className="flex-grow-1">
          <div className="custom-topbar d-flex justify-content-between align-items-center py-2 px-3 shadow-sm">
            <div className="d-flex ">
              <button
                className="btn ms-3 me-3 click-custom"
                onClick={handleSideBar}>
                {sidebarVisible ? (
                  <i className="fa fa-times" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-bars" aria-hidden="true"></i>
                )}
              </button>
              <div className="d-flex flex-column ">
                <h3 className="m-0">Welcome {user.name}</h3>
                <p>{new Date().toDateString()}</p>
              </div>
            </div>
          </div>

          {sidebarVisible && (
            <div className="d-block d-sm-none custom-brown p-3">
              <ul className="nav flex-column text-center">
                <li className="nav-item mb-2">
                  <Link href="/admin/dashboard" className="nav-link text-nav">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/admin/users" className="nav-link text-nav">
                    View Students
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/admin/teachers" className="nav-link text-nav">
                    View Teachers
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    href="/admin/academics/pendingresults"
                    className="nav-link text-nav">
                    View Uploaded Results
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    href="/admin/academics/receipts"
                    className="nav-link text-nav">
                    Payment History
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <button onClick={handleLogout} className="sm-logout-btn">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div className="container my-5">
            <div className="card shadow bg-shadow">
              <div className="card-header bg-card text-white">
                <h5 className="mb-0">Payment History</h5>
              </div>
              <div className="card-body">
                <form className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label htmlFor="" className="form-label">
                      Enter Identity Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={identityNumber.toUpperCase()}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      placeholder="Enter Identity Number"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Term</label>
                    <select
                      className="form-select"
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}>
                      <option value="">Select Term</option>
                      <option value="First Term">First Term</option>
                      <option value="Second Term">Second Term</option>
                      <option value="Third Term">Third Term</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Session</label>
                    <select
                      className="form-select"
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}>
                      <option value="">Select Session</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                      <option value="2028/2029">2028/2029</option>
                      <option value="2029/2030">2029/2030</option>
                    </select>
                  </div>

                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={searchLoading || identityNumber.trim() === ""}
                      className="btn btn-primary w-100">
                      {searchLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"></span>
                          Searching....
                        </>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-body">
                <form className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label">Select Term</label>
                    <select
                      className="form-select"
                      value={selectedTerm}
                      onChange={handleTermChange}>
                      <option value="First Term">First Term</option>
                      <option value="Second Term">Second Term</option>
                      <option value="Third Term">Third Term</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Select Session</label>
                    <select
                      className="form-select"
                      value={selectedSession}
                      onChange={handleSessionChange}>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2025/2026">2025/2026</option>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                      <option value="2028/2029">2028/2029</option>
                    </select>
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      type="button"
                      onClick={fetchReceipt}
                      disabled={loading}
                      className="btn btn-primary w-100">
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"></span>
                          Loading....
                        </>
                      ) : (
                        "Load Receipts"
                      )}
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                      <thead style={{ backgroundColor: "#D7CCC8" }}>
                        <tr>
                          <th>Date</th>
                          <th>Student Name</th>
                          <th>Student ID No</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Channel</th>
                          <th>Payment ID</th>
                          <th>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipts.length === 0 && !loading && !searchLoading ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              {error || "No receipts href display"}
                            </td>
                          </tr>
                        ) : (
                          receipts.map((receipt, index) => (
                            <tr key={receipt.id || index}>
                              <td>
                                {new Date(receipt.paid_at).toLocaleString()}
                              </td>
                              <td>{receipt.name}</td>
                              <td>{receipt.identitynumber}</td>
                              <td>{receipt.amount}</td>
                              <td>{receipt.status}</td>
                              <td>{receipt.channel}</td>
                              <td>{receipt.paymentid}</td>
                              <td>{receipt.reference}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateReceipt;
