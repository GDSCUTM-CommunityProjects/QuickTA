import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  Text,
  VStack,
  Heading,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ChatBoxTopNav = ({
  courseCode,
  currConvoID,
  openConvoHistory,
  setOpenConvoHistory,
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const fileDownload = require("js-file-download");
  const [reportMsg, setReportMsg] = useState("");
  const [error, setError] = useState();

  return (
    <>
      <div
        style={{
          // padding: "12px 12px",,
          display: "flex",
          borderBottom: "1px solid #EAEAEA",
          alignItems: "center",
          backgroundColor: "white",
          height: "15%",
          borderTopRightRadius: "8px",
        }}
      >
        <HStack
          // paddingY={"12px"}
          paddingX={"12px"}
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            backgroundColor: "white",
          }}
          borderTopRightRadius={"8px"}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Hamburger icon for smaller screens */}
            {!openConvoHistory && (
              <div className="hamburger-icon-div">
                <IconButton
                  bgColor={"white"}
                  className="hamburger-icon"
                  border={"1px solid #EAEAEA"}
                  aria-label="Open Conversation History Menu"
                  size="sm"
                  icon={<HamburgerIcon />}
                  onClick={() => {
                    setOpenConvoHistory(true);
                  }}
                  style={{
                    marginRight: "12px",
                    marginLeft: "4px",
                    marginBottom: "6px",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <Avatar 
              style={{ 
                background: "#A0AEBF",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginRight: "5px",
                marginLeft: "5px",
            }}>
              <AvatarBadge
                boxSize={"1.2em"}
                style={{ 
                  borderRadius: "60px", 
                  border: "3px solid #C6F6D4",
                  margin: 0,
                  background: "#68D391"
                }}
              />
            </Avatar>
            <div>
              <Text>
                <Text
                  style={{
                    fontSize: "14px",
                    marginLeft: "4px",
                    lineHeight: "1.2",
                  }}
                >
                  Automated teaching assistant for
                </Text>
                <Heading
                  style={{
                    color: "#012E8A",
                    fontWeight: "700",
                    fontSize: "30px",
                    marginLeft: "4px",
                    lineHeight: "0.9",
                  }}
                >
                  {courseCode}
                </Heading>
              </Text>
            </div>
          </div>

          <div
            className={`chatbox-topnav-buttons`}
            style={{
              display: "flex",
              // flexDirection: "row",
              alignItems: "center",
              maxWidth: "140px",
              height: "100%",
            }}
          >
            {/* Download Conversation Button */}
            <Button
              variant={"ghost"}
              // disabled={currConvoID === ""}
              style={{
                padding: "8px",
                cursor: currConvoID ? "pointer" : "not-allowed",
                color: currConvoID ? "#012E8A" : "#aaa",
              }}
              className="top-nav-button"
              onClick={() => {
                if (currConvoID) {
                  axios
                    .post(
                      process.env.REACT_APP_API_URL +
                        `/student/conversation/history/csv?conversation_id=${currConvoID}`,
                      { conversation_id: currConvoID }
                    )
                    .then((response) => {
                      if (response.headers["content-disposition"]) {
                        fileDownload(
                          response.data,
                          response.headers["content-disposition"].split('"')[1]
                        );
                      }
                    })
                    .catch((err) => {
                      setError(err);
                      // console.log(err);
                    });
                } else {
                  // console.log(
                  //   "Must be in a conversation to download the chatlog!"
                  // );
                }
              }}
            >
              <Tooltip
                background={"#2F3747"}
                color={"white"}
                paddingX={2}
                borderRadius={8}
                fontSize={"sm"}
                label={
                  currConvoID !== ""
                    ? "This may take a couple of minutes"
                    : "Start a new conversation first!"
                }
              >
                <VStack>
                  <FontAwesomeIcon icon={faDownload} size={"lg"} />
                  <div className="top-nav-buttons-text">
                    <Text
                      fontSize="2xs"
                      style={{
                        wordWrap: "normal",
                        whiteSpace: "normal",
                        lineHeight: "1.2",
                        fontWeight: "600",
                      }}
                    >
                      Download Conversation
                    </Text>
                  </div>
                </VStack>
              </Tooltip>
            </Button>
            {/* Report Conversation Button */}
            <Button
             style={{
              padding: "8px",
              fontWeight: "600",
              cursor: currConvoID ? "pointer" : "not-allowed",
              color: currConvoID ? "#d63a3a" : "#aaa",
             }}
              className="top-nav-button"
              variant={"ghost"}
              onClick={() => { if (currConvoID) { setIsOpen(true); } }}
            >
              <Tooltip
                background={"#2F3747"}
                color={"white"}
                paddingX={2}
                borderRadius={8}
                fontSize={"sm"}  
                label={
                  currConvoID ? "See a bug?" : "Start a new conversation first!"
                }
              >
                <VStack>
                  <FontAwesomeIcon icon={faBug} size={"lg"} />
                  <div className="top-nav-buttons-text">
                    <Text
                      fontSize="2xs"
                      style={{
                        wordWrap: "normal",
                        whiteSpace: "normal",
                      }}
                    >
                      Report
                    </Text>
                  </div>
                </VStack>
              </Tooltip>
            </Button>
          </div>

          <Modal 
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Box sx={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40%',
              bgcolor: 'background.paper',
              boxShadow: 10,
              pt: 2,
              px: 4,
              pb: 3,
              borderRadius: '8px',
              minWidth: '450px',
            }}>
              <Box>
                <Box>
                  <span style={{ fontWeight: '600', fontStyle: 'Poppins', fontSize: '20px', lineHeight: '30px' }}>Report Bug</span>
                </Box>
                <Textarea
                  css={{ resize: "none" }}
                  style={{ 
                    marginTop: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    padding: '10px',
                  }}
                  placeholder={
                    "Please try your best to describe the problem you encountered!"
                  }
                  width={"100%"}
                  minBlockSize={"300px"}
                  onChange={(e) => setReportMsg(e.target.value)}
                />
                <Box>
                  <Button
                    className="grey-button"
                    style={{ marginRight: "8px" }}
                    onClick={() => { setIsOpen(false); }}
                  >
                    Close
                  </Button>
                  <Button
                    className="red-button"
                    onClick={() => {
                      if (reportMsg) {
                        axios
                          .post(
                            process.env.REACT_APP_API_URL + "/student/report",
                            {
                              conversation_id: currConvoID,
                              msg: reportMsg,
                            }
                          )
                          .then(
                            (res) => {}
                            // console.log("Reported!")
                          )
                          .catch((err) => {
                            setError(err);
                            // console.log(err);
                            // onErrOpen();
                          });
                        setIsOpen(false);
                      }
                    }}
                  >
                    Report
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
        </HStack>
      </div>
      {/* <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} /> */}
    </>
  );
};

export default ChatBoxTopNav;
