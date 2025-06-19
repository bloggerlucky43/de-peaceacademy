"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import TeacherSidebar from "../../sidebar";
import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function EditResult() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("SS1");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState({});
  const router = useRouter();
  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
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

  const handleClassChange = (e) => setSelectedClass(e.target.value);
  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);

  //Dont forget href include teacher id
  const teacherId = user.id;
  // console.log("The teacher id is", teacherId);

  const HandleStudentLoading = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${bApp}/api/fetchstudent/result?teacherId=${teacherId}&className=${selectedClass}&subject=${selectedSubject}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed href fetch students");
      setLoading(false);
      const data = await response.json();
      // console.log(data);
      setStudents(data.results); // assuming backend sends { students: [...] }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;

    if (field === "test_score" || field === "exam_score") {
      const test = parseInt(updated[index].test_score) || 0;
      const exam = parseInt(updated[index].exam_score) || 0;
      const total = test + exam;
      console.log(test, exam, total);
      updated[index].totalscore = total;
      updated[index].grade =
        total >= 70
          ? "A"
          : total >= 60
          ? "B"
          : total >= 50
          ? "C"
          : total >= 40
          ? "D"
          : total >= 30
          ? "E"
          : "F";
    }
    setStudents(updated);
  };

  const handleSaveResults = async (student) => {
    // Set loading true for this student
    setSaveLoading((prev) => ({ ...prev, [student.id]: true }));

    const result = {
      student_id: student.student_id,
      test_score: student.test_score,
      exam_score: student.exam_score,
      grade: student.grade,
      comment: student.comment,
      term: user?.term,
      session: user?.session,
      totalscore: student.totalscore,
    };

    // console.log("Sending href the backend", result);

    try {
      const response = await fetch(`${bApp}/api/single_upload`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_name: selectedClass,
          subject: selectedSubject,
          teacher_id: teacherId,
          result,
        }),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        alert("Results saved successfully!");
      } else {
        alert(data.message || "Failed href save results.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving results.");
    } finally {
      setSaveLoading((prev) => {
        const newState = { ...prev };
        delete newState[student.id];
        return newState;
      });
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
        {sidebarVisible && <TeacherSidebar />}

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
            <div className="card shadow bg-shadow">
              <div className="card-header bg-card text-white">
                <h5 className="mb-0">Edit Student Results</h5>
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
                  <div className="col-md-4">
                    <label className="form-label">Select Subject</label>
                    <select
                      className="form-select"
                      value={selectedSubject}
                      onChange={handleSubjectChange}>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Basic-science">Basic-Science</option>
                      <option value="Basic-Technology">Basic Technology</option>
                      <option value="CCA">CCA</option>
                      <option value="Civic Education">Civic Education</option>
                      <option value="Home Economics">Home Economics</option>
                      <option value="Business Studies">Business Studies</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="CRS">C.R.S</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="Government">Government</option>
                      <option value="Literature">Literature</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Account">Account</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Animal Husbandry">Animal Husbandry</option>
                      <option value="Agricultural Science">
                        Agricultural Science
                      </option>
                      <option value="Further Mathematics">
                        Further Mathematics
                      </option>
                      <option value="Geography">Geography</option>
                      <option value="Economics">Economics</option>
                      <option value="Biology">Biology</option>
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
                          Loading....
                        </>
                      ) : (
                        "Load Students"
                      )}
                    </button>
                  </div>
                </form>

                <form>
                  <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                      <thead style={{ backgroundColor: "#D7CCC8" }}>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Test Score</th>
                          <th>Exam Score</th>
                          <th>Total Score</th>
                          <th>Grade</th>
                          <th>Teacher's Comment</th>
                          <th>Status</th>
                          <th>Save</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td>{student.student_name}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control test-score"
                                value={student.test_score}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "test_score",
                                    e.target.value
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="form-control exam-score"
                                value={student.exam_score}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "exam_score",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control total-score"
                                value={student.totalscore}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control grade"
                                value={student.grade}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Excellent, Good..."
                                value={student.comment}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "comment",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="False,True..."
                                value={
                                  student.approved === false
                                    ? "Unapproved"
                                    : "Approved"
                                }
                                disabled
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleSaveResults(student)}
                                disabled={!!saveLoading[student.id]}
                                className="btn btn-success mt-3">
                                {saveLoading[student.id] ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"></span>
                                    Saving...
                                  </>
                                ) : (
                                  "Save"
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
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
}
