import { useState } from "react";
import TodoData from "./todo.data";
import TodoInput from "./todo.input";

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoList = () => {
  const [listTodo, setListTodo] = useState<ITodo[]>([]);

  const addNewTodo = (newTodo: ITodo) => {
    setListTodo((prev) => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setListTodo((prev) => prev.filter((todo) => todo.id !== id));
  };
  return (
    <>
      <TodoInput addNewTodo={addNewTodo} />
      <TodoData owner={"kien"} todos={listTodo} deleteTodo={deleteTodo} />
    </>
  );
};

export default TodoList;
