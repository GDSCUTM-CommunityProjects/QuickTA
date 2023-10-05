import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import ErrorDrawer from "../ErrorDrawer";

const UploadCourseList = ({ courseID }) => {
  const dropArea = React.useRef(null);
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  // Handles the drag and drop operation of a CSV file
  const handleDrop = async (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("course_id", courseID);

    await axios
      .post(process.env.REACT_APP_API_URL + "/user/batch-add/csv", formData)
      .then((res) => {
        // Handle the response
        // console.log(res);
      })
      .catch((err) => {
        // Handle the error
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  useEffect(() => {
    const element = dropArea.current;
    if (!element) return;

    function handleDragOver(event) {
      event.preventDefault();
      element.classList.add("dragover");
    }

    function handleDragEnter(event) {
      event.preventDefault();
      element.classList.add("dragenter");
    }

    function handleDragLeave(event) {
      event.preventDefault();
      element.classList.remove("dragover");
      element.classList.remove("dragenter");
    }

    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragleave", handleDragLeave);

    return () => {
      element.removeEventListener("dragover", handleDragOver);
      element.removeEventListener("dragenter", handleDragEnter);
      element.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dropArea}
        onDrop={handleDrop}
        style={{
          background: "#2D54A6",
          color: "white",
          fontFamily: "Poppins",
          fontWeight: 500,
          padding: "8px",
          borderRadius: "8px",
          fontSize: "16px",
        }}
      >
        Import Student Course List
      </div>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default UploadCourseList;
