"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import TeacherSidebar from "../sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;

export default function TeacherDashboard() {
  // State href toggle sidebar visibility
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [stats, setStats] = useState({
    approved_count: 0,
    unapproved_count: 0,
  });
  const router = useRouter();

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const teacherId = user?.id;
    const term = user?.term;
    const session = user?.session;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${bApp}/api/results/approval-count?teacherId=${teacherId}&term=${term}&session=${session}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching from backend", error);
      }
    };

    fetchData();
  }, [router, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

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

  const userName = user.name;
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
        {sidebarVisible && <TeacherSidebar />}

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
                  <Link href="/teacher/dashboard" className="nav-link text-nav">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item mb-2">
                  <Link href="/teacher/results" className="nav-link text-nav">
                    Upload Result
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    href="/teacher/edit/results"
                    className="nav-link text-nav">
                    Edit Result
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
            {/* <!-- Welcome Header --> */}
            <div className="mb-4 head-mg">
              <h2 className="text-dark">
                {getGreeting()}, {userName}
              </h2>
              <p className="text-muted">Current session: {user?.session}</p>
            </div>

            <div className="row text-white mb-4">
              <div className="col-md-3">
                <div className="card bg-warning shadow-sm">
                  <div className="card-body">
                    <h6>Pending Results</h6>
                    <h4>{stats.unapproved_count}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-card1 shadow-sm">
                  <div className="card-body">
                    <h6>Approved Results</h6>
                    <h4>{stats.approved_count}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <h5>Enter Results</h5>
                    <p className="text-muted">
                      Input student grades and comments.
                    </p>
                    <Link
                      href="/teacher/results"
                      className="btn btn-outline-success">
                      Enter Results
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <h5>Update Result</h5>
                    <p className="text-muted">
                      Update student grades and comments.
                    </p>
                    <Link
                      href="/teacher/edit/results"
                      className="btn btn-outline-warning">
                      Manage Result
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
}
