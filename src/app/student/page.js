"use client";
import { $authenStore } from "@/libs/authenStore";
import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useStore } from "@nanostores/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentPage() {
  const [myCourses, setMyCourses] = useState(null);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);
  const [courseNo, setCourseNo] = useState();
  const router = useRouter();

  const { token, authenUsername } = useStore($authenStore);

  const loadMyCourses = async () => {
    setLoadingMyCourses(true);
    const resp = await axios.get("/api/enrollment", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyCourses(resp.data.courses);
    setLoadingMyCourses(false);
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  const logout = () => {
    router.push("/");
    localStorage.removeItem("token");
    localStorage.removeItem("authenUsername");
  };

  const callEnrollApi = async () => {
    try {
      const resp = await axios.post(
        "/api/enrollment/",
        {
          courseNo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourseNo("");
      //load my courses again
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else alert(error.message);
    }
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group>
          <Title order={4}>Hi, {authenUsername}</Title>
          <Button color="red" onClick={logout}>
            Logout
          </Button>
        </Group>
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>My Course(s)</Title>

        {myCourses &&
          myCourses.map((course) => (
            <Text key={course.courseNo}>
              {course.courseNo} - {course.title}
            </Text>
          ))}
        {loadingMyCourses && <Loader variant="dots" />}
      </Paper>

      <Paper withBorder p="md">
        <Title order={4}> Enroll a Course</Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            callEnrollApi();
          }}
        >
          <Group>
            <TextInput
              placeholder="6 Digits Course No."
              maxLength={6}
              minLength={6}
              pattern="^[0-9]*$"
              required
              onChange={(e) => setCourseNo(e.target.value)}
              value={courseNo}
            />
            <Button type="submit">Enroll</Button>
          </Group>
        </form>
      </Paper>
    </Stack>
  );
}
