"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function PayFee() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [totalFee, setTotalFee] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
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

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;
    console.log(userId);
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
          console.log("The response from backend is", data);
          setEmail(data.result[0].email);
          setTotalFee(data.result[0].schoolfee + data.result[0].previouslypaid);
          console.log(data.result[0].email);
          setTotalPaid(data.result[0].previouslypaid);
          setOutstanding(data.result[0].schoolfee);
        }
      } catch (error) {
        console.error("Unable href fetch from backend", error);
      }
    };

    fetchData();
  }, [user?.id]);

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

  const handleOnClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !amount) {
      alert("Please fill in all the fields before proceeding href payment!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${bApp}/api/initialize-payment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, amount }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        console.error("Failed href initialize payment:", data);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
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

  return (
    <>
      <div className="d-flex topdiv vh-100">
        {/* Sidebar - Toggled visibility */}
        {sidebarVisible && <Sidebar />}

        <div className="flex-grow-1">
          {/* Top Bar */}
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

          <div className="container my-5">
            <div className="card shadow  bg-shadow">
              <div className="card-header table-bg text-white">
                <h4 className="mb-0 bg-card">
                  Fee Payment- {user.term}, {user.session}
                </h4>
              </div>
              <div className="card-body">
                {/* <!-- Fee Summary --> */}
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="p-3 bg-light border rounded">
                      <strong>Total Fee:</strong> #{totalFee}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-success text-white border rounded">
                      <strong>Paid:</strong> #{totalPaid}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-warning text-dark border rounded">
                      <strong>Outstanding:</strong> #{outstanding}
                    </div>
                  </div>
                </div>

                <div className="container">
                  <form onSubmit={handleOnClick}>
                    <div className="form-group mb-4">
                      <label htmlFor="exampleInputNumber">Amount</label>
                      <input
                        type="num"
                        className="form-control bg-custom-input"
                        id="exampleInputNumber"
                        placeholder="Enter the amount you want href pay"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mt-3">
                      <button
                        type="submit"
                        className="btn bg-card text-white"
                        disabled={loading}>
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
