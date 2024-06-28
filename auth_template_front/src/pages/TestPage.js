import React, { useEffect, useState } from "react";
import { Col, ProgressBar, Row } from "react-bootstrap";
export default function TestPage() {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update progress based on the current velocity
      if (progress <= 100)
        setProgress((prevProgress) => prevProgress + velocity);

      // Adjust velocity at certain progress points (e.g., 50%)
      if (progress >= 40) {
        setVelocity(2); // Change velocity to 2
      }
      if (progress >= 65) {
        setVelocity(1); // Change velocity to 2
      }
      if (progress >= 75) {
        setVelocity(0.5); // Change velocity to 2
      }
      // Complete the progress bar at 100%
      if (progress >= 100) {
        clearInterval(intervalId); // Stop the interval when progress reaches 100%
      }
    }, 100); // Adjust the interval duration (in milliseconds) based on your needs

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [progress, velocity]);
  return (
    <Row>
      <Col>
        <ProgressBar animated now={progress} />
      </Col>
    </Row>
  );
}
