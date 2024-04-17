import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Code,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash, CircleCheck } from "tabler-icons-react";
import { RotatingLines } from "react-loader-spinner";

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import useTodo from "./hooks/useTodo";

export default function TodoItem() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [pdf, setpdf] = useState();
  const [excel, setExcel] = useState();
  const { todos, loading, error, create_todos, delete_todos, update_todos, create_todos_by_excel } =
    useTodo();

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");

  function createTask(event) {
    event.preventDefault();
    const formData = new FormData();
    pdf && formData.append("file", pdf);
    formData.append("title", taskTitle.current.value);
    formData.append("description", taskSummary.current.value);
    saveTasks(formData);
  }

  function createTaskByExcel(event) {
    event.preventDefault();
    const formData = new FormData();
    excel && formData.append("file", excel);
    saveExcelTasks(formData);
  }

  function deleteTask(id) {
    delete_todos(id);
  }

  function loadTasks() {
    if (todos && todos.length) {
      setTasks(todos);
    }
  }

  function saveTasks(tasks) {
    create_todos(tasks);
  }

  function saveExcelTasks(tasks) {
    create_todos_by_excel(tasks);
  }

  useEffect(() => {
    loadTasks();
  }, [todos]);

  const fileUpload = (e) => {
    setpdf(e.target.files[0]);
  };

  const excelUpload = (e) => {
    setExcel(e.target.files[0]);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={loading}
        />
      </div>
    );
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Description"}
              label={"Description"}
            />

            <p>Enter a pdf file</p>
            <input type="file" accept=".pdf" onChange={fileUpload} />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={(event) => {
                  createTask(event);
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>
          <Modal
            opened={excelOpen}
            size={"md"}
            title={"Excel Task"}
            withCloseButton={false}
            onClose={() => {
              setExcelOpen(false);
            }}
            centered
          >
            <input type="file" accept=".xlsx" onChange={excelUpload}/>
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setExcelOpen(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={(event) => {
				  createTaskByExcel(event);
                  setExcelOpen(false);
                }}
              >
                Create Tasks
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                console.log({ taskimp: task });
                if (task.title && !task.isDeleted) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.title}</Text>
                        <Group>
                          <ActionIcon
                            onClick={() => {
                              deleteTask(task?._id);
                            }}
                            color={"red"}
                            variant={"transparent"}
                          >
                            <Trash />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => {
                              update_todos(task?._id);
                            }}
                            color={"blue"}
                          >
                            <CircleCheck />
                          </ActionIcon>
                        </Group>
                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task?.description
                          ? task.description
                          : "No summary was provided for this task"}
                      </Text>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task?.completed
                          ? "Congrats!!! this task is completed"
                          : "Attention!!! this task is still pending"}
                      </Text>
                    </Card>
                  );
                }
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
            <Button
              onClick={() => {
                setExcelOpen(true);
              }}
              fullWidth
              mt={"md"}
            >
              Add Multiple Tasks
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
