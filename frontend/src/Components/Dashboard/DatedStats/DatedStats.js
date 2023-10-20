import {
  VStack,
  Flex,
  Spacer,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import StatCard from "../components/StatCard";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import FrequencyCard from "./FrequencyCard";
import AnalyticsCard from "../components/AnalyticsCard";
import DatedLineChart from "../components/DatedLineChart";
import { Grid } from "@mui/material";
import UniqueUsersCard from "./UniqueUsersCard";
import ChatlogResponseRateCard from "./ChatlogResponseRateCard";
import ConversationResponseRateCard from "./ConversationResponseRateCard";
import ReportedConversationCard from "./ReportedConversationsCard";
import SurveyDistributionBarChart from "../components/SurveyDistributionBarChart";


const DatedStats = ({ isWeekly, courseID, setIsLoading }) => {
  const [avgRating, setAvgRating] = useState({
    avgRating: 0,
    avgRatingDelta: 0,
  });
  
  const [avgComfort, setAvgComfort] = useState({
    avgComfort: 0,
    avgComfortDelta: 0,
  });
  const [numReport, setNumReport] = useState({ numReport: 0 });

  // Fetch file loader for headers
  const fileDownload = require("js-file-download");
  const [error, setError] = useState();
  function computePrevAvg(data, currAvg) {
    // we need to look at avg of indices 0, .. , data-2
    if (data.length <= 1) {
      return 0;
    }
    let x = currAvg * data.length;
    x -= data[data.length - 1];
    if (data.length === 1) {
      return Math.round((currAvg - x / 1) * 100) / 100;
    } else {
      return Math.round((currAvg - x / (data.length - 1)) * 100) / 100;
    }
  }

  return (
    <>
      <Grid container columnSpacing={{ xs: 1, md: 2}} rowSpacing={{ xs: 1, md: 2 }}>
        {/* Row 1 */}
        <Grid item xs={6} md={3}>
          <UniqueUsersCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          <ChatlogResponseRateCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          <ConversationResponseRateCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          <ReportedConversationCard courseID={courseID} />
        </Grid>
        {/* Row 2 */}
        <Grid item xs={12} md={6}>
          <AnalyticsCard>
            <DatedLineChart 
              title={"Interaction Frequency"} 
              courseID={courseID}
              height={385}
            />
          </AnalyticsCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsCard>
            <SurveyDistributionBarChart 
              title={"Pre-Survey Question Distribution"}
              height={342}
              questionIds={[
                "a4dffcc8-1ee4-4361-99b3-6231772b0e19",
                "1a8ddf81-501d-4254-a0c8-4704ef081326",
                "5625f3ba-b627-4927-a43e-b711796ef9b1",
                "b1532779-eb57-4f0b-9ed0-55274921e5f4"
              ]}
            />
          </AnalyticsCard>
        </Grid>
        {/* Row 3 */}
        <Grid item xs={12} md={6}>
          <FrequencyCard courseID={courseID} m={4} />
        </Grid>
        
      </Grid>


          

         
         


      {/* <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} /> */}
    </>
  );
};

export default DatedStats;
