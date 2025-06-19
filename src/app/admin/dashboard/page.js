"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import AdminSideBar from "../adminsidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;
const AdminDashboard = () => {
  const { user, setUser, pageloading } = useContext(AuthContext);
  // State href toggle sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [stats, setStats] = useState({
    unapproved_count: 0,
    teacher_count: 0,
    student_count: 0,
    total_amount_paid: 0,
  });
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

  const adminId = user.id;
  const term = user.term;
  const session = user.session;
  const userName = user.name;
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${bApp}/api/get-dashboard?session=${session}&term=${term}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          setStats(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchData();
  }, [user?.session, user?.term]);

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
        {/* TeacherSidebar - Toggled visibility */}
        {sidebarVisible && <AdminSideBar />}

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
                <h3 className="m-0">Welcome {userName}</h3>
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
            <div className="row g-4 bg-shadow">
              <div className="col-md-3">
                <div className="card text-white bg-card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Total Students</h5>
                    <p className="card-text fs-4">{stats.student_count}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-white bg-success shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Total Teachers</h5>
                    <p className="card-text fs-4">{stats.teacher_count}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-white bg-warning shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Fees Collected</h5>
                    <p className="card-text fs-4">₦{stats.total_amount_paid}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-white bg-danger shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title">Pending Results</h5>
                    <p className="card-text fs-4">{stats.unapproved_count}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* 
  <!-- Quick Links --> */}
            <div className="card mt-5 shadow">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-3">
                    <Link
                      href="/admin/users"
                      className="btn btn-outline-primary w-100">
                      Manage Students
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link
                      href="/admin/teachers"
                      className="btn btn-outline-success w-100">
                      Manage Teachers
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link
                      href="/admin/academics/pendingresults"
                      className="btn btn-outline-warning w-100">
                      Approve Pending Results
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link
                      href="/admin/academics/receipts"
                      className="btn btn-outline-danger w-100">
                      Generate Receipt
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
