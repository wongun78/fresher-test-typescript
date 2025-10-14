interface IProps {
  todos: { id: number; title: string; completed: boolean }[];
  owner?: string;
  deleteTodo: (id: number) => void;
}

const TodoData = (props: IProps) => {
  const { todos, owner = "unknown", deleteTodo } = props;
  return (
    <>
      {" "}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            {todo.title}
            <span> (Owner: {owner})</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>{" "}
    </>
  );
};

export default TodoData;
