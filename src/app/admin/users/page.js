"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSideBar from "../adminsidebar";
import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;
function ListofStudent() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("JSS1");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
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
  const adminId = user.id;
  const term = user.term;
  const session = user.session;
  const userName = user.name;

  const HandleStudentLoading = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${bApp}/api/get-student?classname=${selectedClass}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed href fetch students");

      const data = await response.json();
      // console.log(data);
      setStudents(data.results);
    } catch (error) {
      alert(error.message);
      console.error("error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setIsEditMode(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setEditedStudent(null);
    setIsEditMode(false);
  };

  const handleEditSave = async (updatedStudent) => {
    const updatedList = students.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );
    setStudents(updatedList);
    console.log(updatedList);
    try {
      const updateData = await fetch(`${bApp}/api/update-student`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });

      // console.log(updatedStudent);

      if (updateData.ok) {
        alert("Saved changes successfully");
      }
    } catch (error) {
      console.error("Error updating backend", error.message);
    }

    closeModal();
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want href delete this student?")) {
      // const updatedList = students.filter((s) => s.id !== studentId);
      // setStudents(updatedList);
      try {
        const response = await fetch(`${bApp}/api/delete_user?id=${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          alert("User deleted Successfully");
          setStudents((prev) => prev.filter((s) => s.id !== id));
        } else {
          const data = await response.json();
          alert(data.message || "Failed href delete users.");
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
            <h4 className="mb-4">Manage Students</h4>
            <div className="mb-3 text-end">
              <Link href="/admin/addNewStudent" className="btn btn-primary">
                Add New Student
              </Link>
            </div>

            <div className="card-body">
              <form className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label">Select Class</label>
                  <select
                    className="form-select"
                    onChange={handleClassChange}
                    value={selectedClass}>
                    <option value="JSS1">JSS1</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS3">JSS3</option>
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>
                  </select>
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="submit"
                    onClick={HandleStudentLoading}
                    disabled={loading}
                    className="btn btn-primary w-100">
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      "Load Students"
                    )}
                  </button>
                </div>
              </form>

              <table className="table table-striped table-hover">
                <thead className="table-dark text-center">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Class</th>
                    <th>ID Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No student found
                      </td>
                    </tr>
                  ) : (
                    students.map((s, index) => (
                      <tr key={s.id}>
                        <td>{index + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.class}</td>
                        <td>{s.identitynumber}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleModal(s)}
                            className="btn btn-sm btn-info me-2">
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => {
                              setEditedStudent({ ...s });
                              setIsEditMode(true);
                              setShowModal(true);
                            }}>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            disabled={deleteLoading}
                            onClick={() => handleDeleteStudent(s.id)}>
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {showModal && isEditMode && editedStudent ? (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Student</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={closeModal}></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-2">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.name}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label>Gender</label>
                            <select
                              className="form-control"
                              value={editedStudent.gender}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  gender: e.target.value,
                                })
                              }>
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                          <div className="mb-2">
                            <label>Class</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.class}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  class: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label>ID Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.identitynumber}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  identitynumber: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label>Address</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.address}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label>Date of Birth</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.dateofbirth}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  dateofbirth: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-2">
                            <label>Contact</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedStudent.contact}
                              onChange={(e) =>
                                setEditedStudent({
                                  ...editedStudent,
                                  contact: e.target.value,
                                })
                              }
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn btn-secondary"
                          onClick={closeModal}>
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleEditSave(editedStudent)}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                showModal &&
                selectedStudent && (
                  <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog">
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Student Details</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                          <p>
                            <strong>Name:</strong> {selectedStudent.name}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selectedStudent.gender}
                          </p>
                          <p>
                            <strong>Class:</strong> {selectedStudent.class}
                          </p>
                          <p>
                            <strong>ID Number:</strong>{" "}
                            {selectedStudent.identitynumber}
                          </p>
                          <p>
                            <strong>Outstanding:</strong>{" "}
                            {selectedStudent.schoolfee -
                              selectedStudent.previouslypaid}
                          </p>
                          <p>
                            <strong>Address:</strong> {selectedStudent.address}
                          </p>
                          <p>
                            <strong>Date of Birth:</strong>{" "}
                            {selectedStudent.dateofbirth}
                          </p>
                          <p>
                            <strong>Contact:</strong> {selectedStudent.contact}
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
                )
              )}

              {showModal && <div className="modal-backdrop fade show"></div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListofStudent;
