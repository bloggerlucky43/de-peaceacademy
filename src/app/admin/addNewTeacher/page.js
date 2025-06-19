"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import AdminSideBar from "../adminsidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;
const AddNewTeacher = () => {
  // State href toggle sidebar visibility
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [currentTerm, setCurrentTerm] = useState("First Term");

  const router = useRouter();
  console.log(
    email,
    fullName,
    gender,
    session,
    dateOfBirth,
    contact,
    password,
    currentTerm
  );
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

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  const userName = user.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !currentTerm ||
      !address ||
      !contact ||
      !password ||
      !gender ||
      !dateOfBirth ||
      !fullName ||
      !session ||
      !email
    ) {
      alert("Please fill in all the fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${bApp}/api/addNewTeacher`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
          gender,
          address,
          contact,
          dateOfBirth,
          password,
          currentTerm,
          session,
        }),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        alert(data.message);
        setLoading(false);
        alert("Student ID is:", data.student.identitynumber);
      }
    } catch (error) {
      console.error("sign up error:", error);
    } finally {
      setLoading(false);
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

          <div className="container head-mg">
            <form onSubmit={handleSubmit}>
              <h3>Add New Teacher</h3>

              <div className="form-group mb-4 my-5">
                <label htmlFor="exampleInputEmail">Email:</label>
                <input
                  type="email"
                  className="form-control bg-custom-input"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Full name:</label>
                <input
                  type="text"
                  className="form-control bg-custom-input"
                  placeholder="Enter name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Date of birth:</label>
                <input
                  type="text"
                  className="form-control bg-custom-input"
                  placeholder="e.g 16 April 2002"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Guardian GSM No:</label>
                <input
                  type="text"
                  className="form-control bg-custom-input"
                  placeholder="e.g 09029293939"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">House Address:</label>
                <input
                  type="text"
                  className="form-control bg-custom-input"
                  placeholder="House Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Current Session:</label>
                <input
                  type="text"
                  className="form-control bg-custom-input"
                  placeholder="e.g 2024/2025"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Current Term:</label>
                <select
                  className="form-select"
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}>
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Gender:</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label htmlFor="exampleInputEmail">Password:</label>
                <input
                  type="password"
                  className="form-control bg-custom-input"
                  placeholder="e.g password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary mt-4 btn-custom w-100 mb-5">
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  "Add Teacher"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewTeacher;
