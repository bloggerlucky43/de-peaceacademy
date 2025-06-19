"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import AdminSideBar from "../adminsidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const bApp = process.env.NEXT_PUBLIC_API_URL;
const TeacherManage = () => {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user && !pageloading) {
      router.push("/login");
    }
  }, [user, pageloading]);

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchTeachers = async () => {
      setError("");
      try {
        const response = await fetch(
          `${bApp}/api/getteachers?adminId=${user?.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        // console.log("the response from backend is:", data);

        if (!response.ok) {
          setError("No record found");
        }

        setTeachers(data);
      } catch (error) {
        setError(error.message || "Failed href fetch teacher data.");
      }
    };

    fetchTeachers();
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

  const handleModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
  };
  const handleMakeAdmin = async (id) => {
    if (window.confirm("Are you sure you want href make this user an admin?")) {
      setAdminLoading(true);

      try {
        const response = await fetch(`${bApp}/api/make_admin?id=${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          alert("Process is successful");
        } else {
          const errorData = await response.json();
          alert("Fail href make an admin" || errorData.message);
        }
      } catch (error) {
        console.error("Fail href make an admin");
        alert("An error occured while making the user an admin");
      } finally {
        setAdminLoading(false);
      }
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want href delete this teacher?")) {
      setDeleteLoading(true);

      try {
        const response = await fetch(`${bApp}/api/delete_user?id=${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          alert("User deleted Successfully");
          setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete users.");
        }
      } catch (error) {
        console.error("Error deleting users", error);
      } finally {
        setDeleteLoading(false);
      }
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
                <h3 className="m-0">Welcome {user?.name}</h3>
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
            <h4 className="mb-4">Manage Teachers</h4>
            <div className="mb-3 text-end">
              <Link href="/admin/addNewTeacher" className="btn btn-success">
                Add New Teacher
              </Link>
            </div>
            <table className="table table-striped table-hover">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      {error || "No teachers record"}
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher, index) => (
                    <tr key={teacher.id || index}>
                      <th>{index + 1}</th>
                      <th>{teacher.name}</th>
                      <th>{teacher.gender}</th>
                      <th>{teacher.contact}</th>
                      <th>
                        <button
                          onClick={() => handleModal(teacher)}
                          className="btn btn-sm btn-info">
                          View
                        </button>

                        <button
                          onClick={() => handleMakeAdmin(teacher.id)}
                          className="btn btn-sm btn-success">
                          {adminLoading &&
                          selectedTeacher?.id === teacher.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Making Admin...
                            </>
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          disabled={deleteLoading}
                          className="btn btn-sm btn-danger">
                          {deleteLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"></span>
                              Deleting....
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </th>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {showModal && selectedTeacher && (
              <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Teacher Details</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                      <p>
                        <strong>Name:</strong> {selectedTeacher.name}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedTeacher.gender}
                      </p>
                      <p>
                        <strong>ID number:</strong>{" "}
                        {selectedTeacher.identitynumber}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedTeacher.address}
                      </p>
                      <p>
                        <strong>Contact:</strong> {selectedTeacher.contact}
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherManage;
