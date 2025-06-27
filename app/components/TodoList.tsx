import { Form } from "react-router";
import { useState } from "react";

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItem[];
}

export const TodoList = ({ todos }: TodoListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleStartEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    } else if (e.key === "Enter") {
      // EnterキーでFormが自動的にsubmitされるため、特別な処理は不要
    }
  };

  return (
    <main className="flex items-center justify-center pt-4 sm:pt-8 lg:pt-16 pb-4 px-2 sm:px-4">
      <div className="flex-1 flex flex-col items-center gap-8 sm:gap-12 lg:gap-16 min-h-0 w-full max-w-2xl">
        <header className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-9">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Todo List
          </h1>
        </header>
        
        <div className="w-full space-y-4 sm:space-y-6">
          <section className="rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
              Add New Task
            </h2>
            
            <Form method="post" className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="text"
                placeholder="Enter a new task..."
                required
                className="flex-1 px-3 sm:px-4 py-3 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-3 sm:py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-900 min-h-[44px] sm:min-h-[40px]"
              >
                Add Todo
              </button>
            </Form>
          </section>
          
          <section className="rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
              Your Tasks
            </h2>
            
            {todos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                No todos yet. Add some tasks to get started!
              </p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[52px] sm:min-h-[48px]"
                  >
                    <Form method="post" className="inline">
                      <input type="hidden" name="action" value="toggle" />
                      <input type="hidden" name="id" value={todo.id} />
                      <button type="submit" className="w-6 h-6 sm:w-5 sm:h-5 relative flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-[20px] sm:min-h-[20px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          readOnly
                          className="w-5 h-5 sm:w-4 sm:h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:border-gray-600 pointer-events-none"
                        />
                      </button>
                    </Form>
                    {editingId === todo.id ? (
                      <Form method="post" className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input type="hidden" name="action" value="update" />
                        <input type="hidden" name="id" value={todo.id} />
                        <input
                          type="text"
                          name="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 min-h-[44px] sm:min-h-[36px]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white text-sm sm:text-xs font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-900 min-h-[44px] sm:min-h-[36px]"
                          >
                            保存
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm sm:text-xs font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-900 min-h-[44px] sm:min-h-[36px]"
                          >
                            キャンセル
                          </button>
                        </div>
                      </Form>
                    ) : (
                      <span
                        onClick={() => handleStartEdit(todo)}
                        className={`flex-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 sm:px-3 py-2 sm:py-1 rounded transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-auto flex items-center ${
                          todo.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                    <Form method="post" className="inline">
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="id" value={todo.id} />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors dark:focus:ring-offset-gray-900 p-2 min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px] sm:p-1 flex items-center justify-center"
                        aria-label={`Delete "${todo.text}"`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </Form>
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