import { useState } from "react";

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

interface IProps {
  name?: string;
  addNewTodo: (todo: ITodo) => void;
}

const TodoInput = (props: IProps) => {
  const [todo, setTodo] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };

  const handleClick = () => {
    if (todo.trim()) {
      const newTodo: ITodo = {
        id: Date.now(),
        title: todo.trim(),
        completed: false,
      };
      props.addNewTodo(newTodo);
      setTodo("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter todo"
        className="border border-gray-300 rounded px-2 py-1 flex-grow"
        value={todo}
        onChange={handleOnChange}
      />
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
};

export default TodoInput;
