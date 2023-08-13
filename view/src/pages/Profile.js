import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Col, Row, Card } from "react-bootstrap";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import Modal from "react-modal";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9999,
    // Higher zIndex to make sure it appears above other elements
  },
  content: {
    width: "60%",
    height: "70%",
    margin: "auto",
    border: "20px solid #F5F5F5",
    borderRadius: "4px",
    padding: "30px",
    background: "#fff",
  },
};

const saveBtn = {
  appearance: "none",
  background: "#000",
  border: "1px solid rgba(27, 31, 35, .15)",
  borderRadius: "6px",
  boxshadow: "rgba(27, 31, 35, .1) 0 1px 0",
  boxsizing: "border-box",
  color: " #fff",
  cursor: "pointer",
  display: "inline-block",
  padding: "6px 16px",
  textalign: "center",
  marginTop: "2rem",
};

const closeBtn = {
  appearance: "none",
  background: "rgb(250 0 0)",
  border: "1px solid rgba(27, 31, 35, .15)",
  borderRadius: "6px",
  boxshadow: "rgba(27, 31, 35, .1) 0 1px 0",
  boxsizing: "border-box",
  color: " #fff",
  cursor: "pointer",
  display: "inline-block",
  padding: "6px 16px",
  textalign: "center",
  marginTop: "2rem",
};

export default function EditButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    yearOfGraduation: "",
    username: "",
    university: "",
    specialty: "",
    summary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle the form submission and update the user's profile data
    console.log("Form data:", formData);
    axios
    .patch(`http://localhost:8080/users/editinfo/${profileData._id}`, formData, {
    })
    .then((response) => {
      // The data has been successfully updated
      console.log("Data updated successfully:", response.data);
      // You can choose to show a success message to the user if needed
    })
    .catch((error) => {
      console.error("Error updating data:", error);
      // You can show an error message to the user if needed
    });
    handleCloseModal();
  };
  const handleChangeImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        console.log("Image URL:", imageUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  let email, token;
  const [profileData, setProfileData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isPendding, setIsPendding] = useState(true);


  useEffect(() => {
    // Get the JWT token from localStorage
    if (localStorage.getItem("userData")) {
      // Get the value of "userData" and remove quotes using replace
      token = localStorage.getItem("userData").replace(/"/g, "");
      // Use the token for further processing (e.g., authentication or API requests)
      console.log("Token:", token);
    } else {
      console.log("No user data found in localStorage.");
    }
    // Make an API request to fetch the user's profile data
    axios
      .get(`http://localhost:8080/users/${token}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
        },
      })
      .then((response) => {
        setProfileData(response.data);
        setFormData(response.data);
        email = response.data.email;
        setIsPendding(false);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });

    axios
      .get("http://localhost:8080/applications/getapplications")
      .then((response) => {
        setApplications(
          response.data.filter((application) => application.email == email)
        );
        console.log("response.data", response.data);
      })
      .catch((error) => {
        // Handle error
        console.error("AxiosError:", error);
      });
  }, []);
  return (
    <div>
      <Header />
      {!isPendding ? (
        <>
          <div className="gradient-custom-2" style={{ backgroundColor: "" }}>
            <MDBContainer className="py-5 h-100">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="9" xl="12">
                  <MDBCard>
                    <div
                      className="rounded-top text-white d-flex flex-row"
                      style={{ backgroundColor: "#000", height: "200px" }}
                    >
                      <div
                        className="ms-4 mt-5 d-flex flex-column"
                        style={{ width: "150px" }}
                      >
                        <MDBCardImage
                          src={
                            profileData.avatar || "https://placehold.co/200x200"
                          }
                          alt="Generic placeholder image"
                          className="mt-4 mb-2 img-thumbnail"
                          fluid
                          style={{ width: "150px", zIndex: "1" }}
                        />
                        <MDBBtn
                          outline
                          color="light"
                          onClick={handleEditProfile}
                          style={{
                            height: "36px",
                            color: "white",
                            backgroundColor: "black",
                            zIndex: "5",
                          }}
                        >
                          Edit profile
                        </MDBBtn>
                      </div>
                      <div className="ms-3" style={{ marginTop: "130px" }}>
                        <MDBTypography tag="h5">
                          {" "}
                          {profileData.firstname} {profileData.lastname}
                        </MDBTypography>
                        <MDBCardText>@{profileData.username}</MDBCardText>
                      </div>
                    </div>
                    <div
                      className="p-4 text-black"
                      style={{ backgroundColor: "#F5F5F5" }}
                    >
                      <div className="d-flex justify-content-end text-center py-1">
                        <div>
                          <MDBCardText className="mb-1 h5">3</MDBCardText>
                          <MDBCardText className="small text-muted mb-0">
                            Applications
                          </MDBCardText>
                        </div>
                        <div className="px-3">
                          <MDBCardText className="mb-1 h5">80</MDBCardText>
                          <MDBCardText className="small text-muted mb-0">
                            Followers
                          </MDBCardText>
                        </div>
                        <div>
                          <MDBCardText className="mb-1 h5">75</MDBCardText>
                          <MDBCardText className="small text-muted mb-0">
                            Following
                          </MDBCardText>
                        </div>
                      </div>
                    </div>
                    <MDBCardBody className="text-black p-4">
                      <div className="mb-5">
                        <p className="lead fw-normal mb-1">About</p>
                        <div
                          className="p-4"
                          style={{ backgroundColor: "#F5F5F5" }}
                        >
                          <MDBCardText className="font-italic mb-1">
                            Name: {profileData.firstname} {profileData.lastname}
                          </MDBCardText>
                          <MDBCardText className="font-italic mb-1">
                            Email: {profileData.email}
                          </MDBCardText>
                          <MDBCardText className="font-italic mb-1">
                            Year of graduation: {profileData.yearofgraduation}
                          </MDBCardText>
                          <MDBCardText className="font-italic mb-1">
                            Univarsity: {profileData.univarsity}
                          </MDBCardText>
                          <MDBCardText className="font-italic mb-1">
                            Speciality: {profileData.speciality}
                          </MDBCardText>
                        </div>
                      </div>
                      <div className="mb-5">
                        <p className="lead fw-normal mb-1">Summary</p>
                        <div
                          className="p-4"
                          style={{ backgroundColor: "#F5F5F5" }}
                        >
                          <MDBCardText className="font-italic mb-1">
                            {profileData.summary}
                          </MDBCardText>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <MDBCardText className="lead fw-normal mb-0">
                          Job Applications
                        </MDBCardText>
                        <MDBCardText className="mb-0">
                          <a href="#!" className="text-muted">
                            Show all
                          </a>
                        </MDBCardText>
                      </div>
                      <MDBRow>
                        <div>
                          {applications.map((application) => (
                            <Card className="mb-3 w-50">
                              <Card.Body>
                                <Card.Title id="title-job">
                                  {application.major}
                                </Card.Title>
                                <Card.Text>{application.companyName}</Card.Text>
                                <Card.Text>{application.location}</Card.Text>
                                <Card.Text>{application.createdAt}</Card.Text>
                                <Link to={`/jobdetails/`} id="more">
                                  Details
                                </Link>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            style={modalStyles}
          >
            <h2 style={{ textAlign: "center", paddingBottom: "1.9rem" }}>
              Edit Profile
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                width: "60%",
                display: "grid",
                gridTemplateColumns: "40% 60%",
                gap: "5px",
                height: "auto",
                margin: "auto",
              }}
            >
              <label className="labelEdit">First Name:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
              <label className="labelEdit">Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
              <label className="labelEdit">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <label className="labelEdit">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label className="labelEdit">Year of Graduation:</label>
              <input
                type="text"
                name="yearOfGraduation"
                value={formData.yearofgraduation}
                onChange={handleChange}
              />
              <label className="labelEdit">University:</label>
              <input
                type="text"
                name="university"
                value={formData.univarsity}
                onChange={handleChange}
              />
              <label className="labelEdit">Speciality:</label>
              <input
                type="text"
                name="specialty"
                value={formData.speciality}
                onChange={handleChange}
              />
              <label className="labelEdit">Summary:</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
              <label className="labelEdit">Picture:</label>
              <input
                type="file"
                name="avatar"
                onChange={handleChangeImage}
              />
              <button type="button" onClick={handleCloseModal} style={closeBtn}>
                Close
              </button>
              <button type="submit" style={saveBtn}>
                Save Changes
              </button>
            </form>
          </Modal>
        </>
      ) : (
        <div className="d-flex justify-content-center" style={{height: "600px"}}>
          <div className="my-auto d-flex flex-column">
            <h1> Please sign in </h1>
            <Link to={`/signin`} id="more" className="text-center">
              Go to sign in page
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
