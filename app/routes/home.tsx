import type { Route } from "./+types/home";
import { TodoList } from "../components/TodoList";
import { todos } from "../../database/schema";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo App" },
    { name: "description", content: "A simple todo list application" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const todoItems = await context.db.select().from(todos).orderBy(todos.created_at);
  
  return { 
    todos: todoItems.map(todo => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed
    }))
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  
  if (!text || text.trim() === "") {
    return { error: "Todo text is required" };
  }
  
  await context.db.insert(todos).values({
    text: text.trim(),
    completed: false,
    created_at: new Date(),
    updated_at: new Date(),
  });
  
  return redirect("/");
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <TodoList todos={loaderData.todos} />;
}
