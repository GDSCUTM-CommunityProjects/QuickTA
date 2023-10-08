import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  useDisclosure,
  VStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";
import PostQuestions from "./PostQuestions";

const TechAssessment = ({
  isOpenTechAssessment,
  onOpenTechAssessment,
  onCloseTechAssessment,
  conversation_id,
  updateMessages,
  updateInConvo,
  updateConvoID,
  UTORid,
  disableAll,
  setDisableAll,
  conversations,
  setConversations,
}) => {
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const {
    isOpen: isPostQOpen,
    onOpen: onPostQOpen,
    onClose: onPostQClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const [code, setCode] = useState({ question: "", language: "" });
  const [options, setOptions] = useState([]);
  const [studentResponse, setStudentResponse] = useState(null);
  const [answer, setAnswer] = useState("");
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [answerFlavorText, setAnswerFlavorText] = useState("");
  const [assessement_question_id, setAssessmentQuestionID] = useState("");
  const [disableAllOption, setDisableAllOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch code, questions, and answer for tech assessment
  const fetchCodeQuestion = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/assessment/question/random?assessment_id=8dd15ed3-da48-487b-82ac-6c2ae12f93b6"
      )
      .then((res) => {
        let data = res.data;
        let { question, parsedCode } = parseCode(data.question);
        setCode({
          question: question,
          code: parsedCode,
          language: data.language,
        });
        setOptions(data.choices);
        setAssessmentQuestionID(data.assessment_question_id);
        // console.log(data.choices);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  useEffect(() => {
    fetchCodeQuestion();
  }, [UTORid]);

  const parseCode = (text) => {
    let start = text.indexOf("```python");
    let end = text.indexOf("```", start + 1);
    let parsedCode = text.substring(start + 9, end);

    let question = text.substring(0, start);

    return { question, parsedCode };
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenTechAssessment}
        onClose={onCloseTechAssessment}
        // size={"lg"}
        style={{
          width: "80%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <span
              style={{
                fontFamily: "Poppins",
              }}
            >
              Technical Assessment
            </span>
          </ModalHeader>
          <ModalBody>
            <VStack>
              <Box width={"100%"} m={5} p={3}>
                <Text>{code.question}</Text>
                <SyntaxHighlighter
                  showLineNumbers={true}
                  wrapLongLines={true}
                  language={"python"}
                  codeTagProps={{ style: { fontSize: "12px" } }}
                >
                  {code.code}
                </SyntaxHighlighter>
              </Box>
              <RadioGroup display="grid" gridGap={4}>
                {options.map((element) => (
                  <Button
                    className={
                      studentResponse != element.choice
                        ? "hidden-border"
                        : !answer
                        ? "selected-border"
                        : answer == studentResponse
                        ? "correct-border"
                        : "wrong-border"
                    }
                    isDisabled={disableAllOption}
                    onClick={(e) => {
                      setStudentResponse(element.choice);
                      // console.log(`Student reponse: ${element.choice}`);
                    }}
                    style={{
                      justifyContent: "left",
                    }}
                  >
                    <Text margins={2}>{element.flavor_text}</Text>
                  </Button>
                ))}
              </RadioGroup>
            </VStack>
          </ModalBody>

          <ModalFooter
            style={{
              display: "flex",
            }}
          >
            {displayAnswer ? (
              <Text mx={10} color={"green"}>
                {answerFlavorText}
              </Text>
            ) : null}
            {isSubmitting && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Spinner
                  color="gray"
                  size={"xs"}
                  style={{ marginRight: "5px" }}
                />
                <Text color="gray" fontSize={"12px"}>
                  Saving response...&nbsp;
                </Text>
              </div>
            )}
            <Button
              isDisabled={studentResponse === null || isSubmitting}
              onClick={() => {
                if (!disableAllOption) {
                  setIsSubmitting(true);
                  //Display Flavor Text
                  setDisableAllOption(true);

                  axios
                    .post(
                      process.env.REACT_APP_API_URL +
                        "/assessment/question/answer",
                      {
                        utorid: UTORid,
                        conversation_id: conversation_id,
                        assessment_id: "8dd15ed3-da48-487b-82ac-6c2ae12f93b6",
                        assessment_question_id: assessement_question_id,
                        answer: studentResponse,
                      }
                    )
                    .then((res) => {
                      let data = res.data;
                      setAnswer(data.correct_answer);
                      setAnswerFlavorText(data.correct_answer_flavor_text);
                      setIsSubmitting(false);
                    })
                    .catch((err) => {
                      setError(err);
                      // console.log(err);
                      onErrOpen();
                    });
                  setDisplayAnswer(true);
                  // setTimeout(() => {
                  //   onCloseTechAssessment();
                  //   onPostQOpen();
                  // }, 5000);

                  // console.log("Submitted answer");
                } else {
                  onCloseTechAssessment();
                  onPostQOpen();
                }
              }}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <PostQuestions
        isOpen={isPostQOpen}
        onOpen={onPostQOpen}
        onClose={onPostQClose}
        onOpenTechAssessment={onOpenTechAssessment}
        setDisableAll={setDisableAll}
        updateMessages={updateMessages}
        updateInConvo={updateInConvo}
        updateConvoID={updateConvoID}
        conversations={conversations}
        conversation_id={conversation_id}
        setConversations={setConversations}
        UTORid={UTORid}
        setStudentResponse={setStudentResponse}
        setDisableAllOption={setDisableAllOption}
        setAnswer={setAnswer}
        setDisplayAnswer={setDisplayAnswer}
        setAnswerFlavorText={setAnswerFlavorText}
      />
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default TechAssessment;
