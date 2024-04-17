import { useState, useEffect } from "react";

function useTodo(url) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    get_todos();
  }, []);

  const get_todos = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks`)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setTodos(response?.response);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const create_todos = (data) => {
    setLoading(true);
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      body: data,
      headers: {
        
      },
    })
      .then((response) => {
        if (!response.success) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      }).finally(() => {
        setLoading(false)
        get_todos()
      });
  };

  const delete_todos = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "POST",
      headers: {
        
      },
    })
      .then((response) => {
        if (!response.success) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      }).finally(() => {
        setLoading(false)
        get_todos()
      });
  };

  const update_todos = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        
      },
    })
      .then((response) => {
        if (!response.success) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      }).finally(() => {
        setLoading(false)
        get_todos()
      });
  };

  const create_todos_by_excel = (data) => {
    setLoading(true);
    fetch("http://localhost:5000/api/tasks/excel/upload", {
      method: "POST",
      body: data,
      headers: {
        
      },
    })
      .then((response) => {
        if (!response.success) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      }).finally(() => {
        setLoading(false)
        get_todos()
      });
  };

  return { todos, loading, error, create_todos,delete_todos,update_todos,create_todos_by_excel };
}

export default useTodo;
