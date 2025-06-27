import { Form } from "react-router";

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItem[];
}

export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 max-w-2xl">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Todo List
          </h1>
        </header>
        
        <div className="w-full space-y-6 px-4">
          <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Add New Task
            </h2>
            
            <Form method="post" className="flex gap-3">
              <input
                type="text"
                name="text"
                placeholder="Enter a new task..."
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-900"
              >
                Add Todo
              </button>
            </Form>
          </section>
          
          <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Your Tasks
            </h2>
            
            {todos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No todos yet. Add some tasks to get started!
              </p>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Form method="post" className="inline">
                      <input type="hidden" name="action" value="toggle" />
                      <input type="hidden" name="id" value={todo.id} />
                      <button type="submit" className="w-4 h-4 relative">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          readOnly
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:border-gray-600 pointer-events-none"
                        />
                      </button>
                    </Form>
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};