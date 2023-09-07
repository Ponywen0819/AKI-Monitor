import { useState, useEffect } from "react";
import { Stack, Heading, Text, Flex, Box } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import Swal from "sweetalert2";

const App = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const sse = new EventSource(
      "https://aki-predict-56d08-default-rtdb.asia-southeast1.firebasedatabase.app/data.json"
    );

    sse.addEventListener("put", (data) => {
      const newData = JSON.parse(data.data);
      console.log(newData);

      const { risk } = newData.data;
      if (risk[risk.length - 1] > 0.7) {
        Swal.fire("發生!! AKI ! ");
      }
      setData(newData.data);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const date = new Date(Date.now());
      const dateString = date.toLocaleDateString("en-US");
      setTime(dateString);
    }, 1000);
  }, []);

  const { subject_id, total_hours, risk, urine } = data || {};

  const labels = new Array(total_hours).fill(1).map((_, i) => i);

  return (
    data && (
      <Box bg={"gray.100"} minH={"100vh"}>
        <Stack align={"center"}>
          <Heading
            fontSize={"5xl"}
            borderBottomWidth={2}
            borderBottomColor={"gray.300"}
            w={"full"}
            textAlign={"center"}
            mb={3}
          >
            AKI 監控中
          </Heading>
          <Text fontSize={"xl"}>SUbject ID : {subject_id}</Text>
          <Text fontSize={"xl"}>現在時間 : {time} </Text>
          <Text fontSize={"xl"}>累計住院時數 : {total_hours} </Text>
        </Stack>
        <Flex w={"1080px"} h={"480px"} mx={"auto"}>
          <Box w={"50%"}>
            <Line
              data={{
                labels: labels,
                datasets: [
                  {
                    label: "預測指數",
                    data: risk,
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
          </Box>
          <Box w={"50%"}>
            <Line
              data={{
                labels: labels,
                datasets: [
                  {
                    label: "累積尿量",
                    data: urine,
                    borderColor: "rgb(53, 162, 235)",
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                ],
              }}
            />
          </Box>
        </Flex>
      </Box>
    )
  );
};
export default App;
