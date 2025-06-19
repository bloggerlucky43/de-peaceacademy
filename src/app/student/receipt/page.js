"use client";

import { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;

export default function Fees() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const router = useRouter();

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${bApp}/api/student_profile?id=${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTotalFee(data.result[0].schoolfee + data.result[0].previouslypaid);
          setTotalPaid(data.result[0].previouslypaid);
          setOutstanding(data.result[0].schoolfee);
        }
      } catch (error) {
        console.error("Internal Server Error", error);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${bApp}/api/receipt?id=${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReceipts(data.receipt);
        }
      } catch (error) {
        console.error("Internal server error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [user?.id]);

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

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Sidebar */}
      {sidebarVisible && <Sidebar />}

      <div className="flex-grow-1">
        {/* Top Bar */}
        <div className="custom-topbar d-flex justify-content-between align-items-center py-2 px-3 shadow-sm flex-wrap">
          <div className="d-flex align-items-start">
            <button className="btn me-3 click-custom" onClick={handleSideBar}>
              {sidebarVisible ? (
                <i className="fa fa-times" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-bars" aria-hidden="true"></i>
              )}
            </button>
            <div>
              <h3 className="m-0">Welcome {user?.name}</h3>
              <p>{new Date().toDateString()}</p>
            </div>
          </div>
        </div>

        {/* Responsive sidebar nav for small devices */}
        {sidebarVisible && (
          <div className="d-block d-sm-none custom-brown p-3">
            <ul className="nav flex-column text-center">
              <li className="nav-item mb-2">
                <Link href="/student/dashboard" className="nav-link text-nav">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/student/profile" className="nav-link text-nav">
                  Profile
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/student/results" className="nav-link text-nav">
                  Result
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/student/payment" className="nav-link text-nav">
                  Pay School Fee
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/student/receipt" className="nav-link text-nav">
                  View Receipt
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

        <div className="container my-4">
          <div className="card shadow bg-shadow">
            <div className="card-header bg-card text-white">
              <h4 className="mb-0">
                Payment & Receipt - {user?.term}, {user?.session}
              </h4>
            </div>
            <div className="card-body">
              {/* Fee Summary */}
              <div className="row mb-4">
                <div className="col-12 col-md-4 mb-3">
                  <div className="p-3 bg-light border rounded text-center">
                    <strong>Total Fee:</strong>
                    <br /> ₦{totalFee}
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <div className="p-3 bg-success text-white border rounded text-center">
                    <strong>Paid:</strong>
                    <br /> ₦{totalPaid}
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <div className="p-3 bg-warning text-dark border rounded text-center">
                    <strong>Outstanding:</strong>
                    <br /> ₦{outstanding}
                  </div>
                </div>
              </div>

              {/* Receipt Table */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="custom-thead">
                      <tr>
                        <th className="text-wrap">Date</th>
                        <th>Amount Paid</th>
                        <th>Payment Method</th>
                        <th>Receipt Number</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No receipt found
                          </td>
                        </tr>
                      ) : (
                        receipts.map((payment) => (
                          <tr key={payment.id}>
                            <td>
                              {new Date(payment.paid_at).toLocaleString()}
                            </td>
                            <td>{payment.amount}</td>
                            <td>{payment.channel}</td>
                            <td>{payment.paymentid}</td>
                            <td>{payment.reference}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3 d-flex flex-wrap gap-2">
                <a href="#" className="btn btn-outline-dark">
                  Print Receipt
                </a>
                <a href="#" className="btn bg-card text-white">
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
