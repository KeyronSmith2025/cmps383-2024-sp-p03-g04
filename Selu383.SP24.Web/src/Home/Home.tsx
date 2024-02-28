import React, { useState } from "react";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Home.css";
import image from "../images/hotel.jpg";
import { BiSearch } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface HotelDto {
  hotelCode: string;
  name: string;
  address: string;
  managerId: string;
}

const Home: React.FC = () => {
  const currentDate = new Date();
  const [location, setLocation] = useState("");
  const [hotels, setHotels] = useState<any[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(currentDate);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(tomorrowDate);
  const [rooms, setRooms] = useState<number[]>([1]);
  const [adults, setAdults] = useState<number[]>([1]);
  const [children, setChildren] = useState<number[]>([0]);

  const getHotels = async () => {
   
      await fetch(`/api/hotels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (x) =>{
        const hotelData = await x.json();
        console.log("sdlkfjdsklfjds",hotelData);
        setHotels(hotelData);
      })
  
  };

  const incrementCount = (type: string, index: number) => {
    if (type === "adults" && adults[index] + children[index] >= 4) {
      return;
    }
    if (type === "children" && adults[index] + children[index] >= 4) {
      return;
    }
    if (type === "rooms" && rooms.length >= 5) {
      return;
    }
    switch (type) {
      case "rooms":
        setRooms([...rooms, rooms.length + 1]);
        setAdults([...adults, 1]);
        setChildren([...children, 0]);
        break;
      case "adults":
        const updatedAdults = [...adults];
        updatedAdults[index] += 1;
        setAdults(updatedAdults);
        break;
      case "children":
        const updatedChildren = [...children];
        updatedChildren[index] += 1;
        setChildren(updatedChildren);
        break;
      default:
        break;
    }
  };

  const decrementCount = (type: string, index: number) => {
    switch (type) {
      case "rooms":
        if (rooms.length > 1) {
          setRooms(rooms.filter((_, i) => i !== index));
          setAdults(adults.filter((_, i) => i !== index));
          setChildren(children.filter((_, i) => i !== index));
        }
        break;
      case "adults":
        if (adults[index] > 1) {
          const updatedAdults = [...adults];
          updatedAdults[index] -= 1;
          setAdults(updatedAdults);
        }
        break;
      case "children":
        if (children[index] > 0) {
          const updatedChildren = [...children];
          updatedChildren[index] -= 1;
          setChildren(updatedChildren);
        }
        break;
      default:
        break;
    }
  };

  return (
    <section
      className="home"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <Row
          className="justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <Col xs={12} sm={6} md={3}>
            <Card className="text-dark bg-light mb-3">
              <Card.Body>
                <Card.Title>Hotels  </Card.Title>
                <Form>
                  <Row className="align-items-center">
                    <Col xs={9}>
                      <Form.Group controlId="location">
                        <Form.Control
                          type="text"
                          placeholder="Search for hotels"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={3}>
                      <Button variant="primary" onClick={getHotels}>
                        <BiSearch />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            {hotels.length > 0 && (
              <Card className="text-dark bg-light mb-3">
                <Card.Body>
                  <Card.Title>Available Hotels</Card.Title>
                  <ul>
                    {hotels.map((hotel, index) => (
                      <li key={index}>{hotel.name}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col>
            <Card className="text-dark bg-light mb-3">
              <Card.Body>
                <Card.Title>Check In</Card.Title>
                <Form.Group controlId="checkInDate">
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date: Date) => setCheckInDate(date)}
                    dateFormat="E MMM dd, yyyy"
                    minDate={new Date()}
                    className="form-control"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="text-dark bg-light mb-3">
              <Card.Body>
                <Card.Title>Check Out</Card.Title>
                <Form.Group controlId="checkOutDate">
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date: Date) => setCheckOutDate(date)}
                    dateFormat="E MMM dd, yyyy"
                    minDate={checkInDate || new Date()}  
                    className="form-control"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Card className="text-dark bg-light mb-3">
              <Card.Body>
                <Card.Title>Rooms & Guests</Card.Title>
                {rooms.map((room, index) => (
                  <div key={index}>
                    <h6>
                      {room} Room {index + 1}
                    </h6>
                    <Form.Group controlId={`adults-${index}`}>
                      <Form.Label>Adults</Form.Label>
                      <Form.Control
                        type="number"
                        value={adults[index]}
                        min={1}
                        max={4}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1 && value <= 4) {
                            const updatedAdults = [...adults];
                            updatedAdults[index] = value;
                            setAdults(updatedAdults);
                          }
                        }}
                      />
                    </Form.Group>
                    <Form.Group controlId={`children-${index}`}>
                      <Form.Label>Children</Form.Label>
                      <Form.Control
                        type="number"
                        value={children[index]}
                        min={0}
                        max={4 - adults[index]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (
                            !isNaN(value) &&
                            value >= 0 &&
                            value <= 4 - adults[index]
                          ) {
                            const updatedChildren = [...children];
                            updatedChildren[index] = value;
                            setChildren(updatedChildren);
                          }
                        }}
                      />
                    </Form.Group>
                    {index === rooms.length - 1 && (
                      <Button
                        variant="secondary"
                        onClick={() => incrementCount("rooms", index)}
                      >
                        Add another room
                      </Button>
                    )}
                    {index !== 0 && (
                      <Button
                        variant="danger"
                        onClick={() => decrementCount("rooms", index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="primary"
                onClick={() => console.log("Update clicked")}
                >
                  Update
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Home;
