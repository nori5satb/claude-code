import type { Route } from "./+types/home";
import { TodoList, type TodoItem } from "../components/TodoList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo App" },
    { name: "description", content: "A simple todo list application" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const todos: TodoItem[] = [
    { id: 1, text: "Learn React Router v7", completed: true },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Write tests", completed: false },
    { id: 4, text: "Deploy to Cloudflare Workers", completed: false },
    { id: 5, text: "Implement todo CRUD operations", completed: false },
  ];

  return { todos };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <TodoList todos={loaderData.todos} />;
}
