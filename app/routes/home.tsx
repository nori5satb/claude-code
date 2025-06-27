import type { Route } from "./+types/home";
import { TodoList } from "../components/TodoList";
import { todos } from "../../database/schema";
import { redirect } from "react-router";
import { eq } from "drizzle-orm";

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
  const action = formData.get("action") as string;
  
  if (action === "toggle") {
    const id = parseInt(formData.get("id") as string);
    
    if (!id) {
      return { error: "Todo ID is required" };
    }
    
    // 現在の完了状態を取得
    const currentTodo = await context.db.select().from(todos).where(eq(todos.id, id)).get();
    
    if (!currentTodo) {
      return { error: "Todo not found" };
    }
    
    // 完了状態を切り替え
    await context.db.update(todos)
      .set({ 
        completed: !currentTodo.completed,
        updated_at: new Date()
      })
      .where(eq(todos.id, id));
    
    return redirect("/");
  }
  
  if (action === "delete") {
    const id = parseInt(formData.get("id") as string);
    
    if (!id) {
      return { error: "Todo ID is required" };
    }
    
    // TODOを削除
    await context.db.delete(todos).where(eq(todos.id, id));
    
    return redirect("/");
  }
  
  // 新しいTODOの作成
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
