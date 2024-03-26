/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./booking.css";
import { useUser } from "../Login/UserContext";
import { Slide, toast } from "react-toastify";

const Booking: React.FC = () => {
  const location = useLocation();
  const {
    selectedHotelInfo,
    checkInDateFormatted,
    checkOutDateFormatted,
    room,
    guests,
  } = location.state || {};

  // Hotel booking form state (consider using a form library like Formik for complex forms)
  const [firstName, setFirstName] = useState("");
  console.log("🚀 ~ firstName:", firstName);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  console.log("🚀 ~ email:", email);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useUser();

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const sendEmail = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // Change to your recipient
      from: "enstayhotels@gmail.com", // Change to your verified sender
      subject: "Room Reservation Confirmation",
      text: "",
      html:
        "<strong>Your reservation has been confirmed!</strong>" +
        "<br>" +
        "<strong>Reservation Info:</strong>" +
        "<br>" +
        "<strong>Hotel Name:</strong> " +
        selectedHotelInfo.name +
        "<br>" +
        "<strong>Room Type:</strong> " +
        room.type +
        "<br>" +
        "<strong>Check In Date:</strong> " +
        checkInDateFormatted +
        "<br>" +
        "<strong>Check Out Date:</strong> " +
        checkOutDateFormatted +
        "<br>" +
        "<strong>Number of Guests:</strong> " +
        guests,
    };

    console.log("email test");

    sgMail
      .send(msg)
      .then(
        (
          response: {
            statusCode(statusCode: any): unknown;
            headers: any;
          }[]
        ) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
        }
      )
      .catch((error: any) => {
        console.error(error);
      });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const reservation = {
      RoomId: room.id,
      HotelId: selectedHotelInfo.id,
      CheckInDate: checkInDateFormatted,
      CheckOutDate: checkOutDateFormatted,
      NumberOfGuests: guests,
      IsPaid: false,
    };

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });

    if (response.ok) {
      toast.success("Your Reservation has been created successfully", {
        transition: Slide,
      });
      sendEmail();
    } else {
      const error = await response.text();
      toast.error(error, {
        transition: Slide,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col lg={6}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="firstName"
              value={user?.userName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              size="lg"
              type="email"
              name="email"
              value={user?.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              size="lg"
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Form.Group controlId="guests">
            <Form.Label>Number of Guests</Form.Label>
            <Form.Control
              size="lg"
              type="number"
              name="guests"
              min={1}
              value={guests}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group controlId="checkInDate">
            <Form.Label>Check In Date</Form.Label>
            <Form.Control
              size="lg"
              type="date"
              name="checkInDate"
              defaultValue={checkInDateFormatted}
              required
            />
          </Form.Group>
        </Col>

        <Col xs={4}>
          <Form.Group controlId="checkOutDate">
            <Form.Label>Check Out Date</Form.Label>
            <Form.Control
              size="lg"
              type="date"
              name="checkOutDate"
              defaultValue={checkOutDateFormatted}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group controlId="hotelName">
            <Form.Label>Hotel Name</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="hotelName"
              defaultValue={selectedHotelInfo.name} // Set default value if available
              disabled // Prevent editing for now
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="roomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="roomType"
              defaultValue={room.type == 0 ? "Single King" : "Double Queen"} // Set default value if available
              disabled // Prevent editing for now
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              width="100%"
              rows={3} // Adjust number of rows as needed
              size="lg"
              name="description"
            />
          </Form.Group>
        </Col>
      </Row>
      <Button
        variant="success"
        style={{
          width: "30%",
        }}
        type="submit"
        onClick={sendEmail}
      >
        Confirm
      </Button>
    </Form>
  );
};

export default Booking;
