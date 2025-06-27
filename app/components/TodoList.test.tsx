import { describe, it, expect } from 'vitest';
import type { TodoItem } from './TodoList';

describe('TodoList Types and Data Structures', () => {
  it('should define TodoItem interface correctly', () => {
    const mockTodo: TodoItem = {
      id: 1,
      text: 'Test todo',
      completed: false,
    };

    expect(mockTodo).toHaveProperty('id');
    expect(mockTodo).toHaveProperty('text');
    expect(mockTodo).toHaveProperty('completed');
    expect(typeof mockTodo.id).toBe('number');
    expect(typeof mockTodo.text).toBe('string');
    expect(typeof mockTodo.completed).toBe('boolean');
  });

  it('should handle completed and incomplete todos', () => {
    const completedTodo: TodoItem = {
      id: 1,
      text: 'Completed task',
      completed: true,
    };

    const incompleteTodo: TodoItem = {
      id: 2,
      text: 'Incomplete task',
      completed: false,
    };

    expect(completedTodo.completed).toBe(true);
    expect(incompleteTodo.completed).toBe(false);
  });

  it('should work with arrays of todos', () => {
    const todos: TodoItem[] = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
    ];

    expect(todos).toHaveLength(2);
    expect(todos[0].completed).toBe(true);
    expect(todos[1].completed).toBe(false);
  });
});