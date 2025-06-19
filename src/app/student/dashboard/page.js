"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useContext } from "react";
import Sidebar from "../sidebar";
import Card from "../card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function Dashboard() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (!user && !pageloading) {
      router.push("/login");
    }
  }, [user, pageloading]);

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

  console.log(user);

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

  const userClass = user.class;
  const term = user.term;
  const identityNumber = user.identitynumber;
  const currentSession = user.session;
  const userName = user.name;

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
                <h3 className="m-0">Welcome {userName}</h3>
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
                    View Result
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

          <div className="content p-4 text-custom-darkbrown custom-content">
            <div className="justify-content-center">
              <h1 className="text-center fs-2 mt-3">{userName}</h1>
              <p className="text-center">Identity Number: {identityNumber}</p>
              <h2 className="text-center fs-5">Class: {userClass}</h2>
              <h3 className="text-center fs-5">
                Current Session: {currentSession} Academic Session
              </h3>
              <h3 className="text-center mb-5 fs-5">Current Term: {term}</h3>
            </div>
            <Card />
          </div>
        </div>
      </div>
    </>
  );
}
