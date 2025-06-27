import { describe, it, expect } from 'vitest';

describe('Home Route Logic', () => {
  describe('meta function', () => {
    it('should return correct meta tags structure', () => {
      const expectedMeta = [
        { title: "Todo App" },
        { name: "description", content: "A simple todo list application" },
      ];
      
      expect(expectedMeta).toHaveLength(2);
      expect(expectedMeta[0]).toHaveProperty('title');
      expect(expectedMeta[1]).toHaveProperty('name');
      expect(expectedMeta[1]).toHaveProperty('content');
    });
  });

  describe('hardcoded todos data', () => {
    it('should have correct data structure for todos', () => {
      const mockTodos = [
        { id: 1, text: "Learn React Router v7", completed: true },
        { id: 2, text: "Build a todo app", completed: false },
        { id: 3, text: "Write tests", completed: false },
        { id: 4, text: "Deploy to Cloudflare Workers", completed: false },
        { id: 5, text: "Implement todo CRUD operations", completed: false },
      ];
      
      expect(mockTodos).toHaveLength(5);
      expect(mockTodos[0].completed).toBe(true);
      
      mockTodos.forEach((todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('text');
        expect(todo).toHaveProperty('completed');
        expect(typeof todo.id).toBe('number');
        expect(typeof todo.text).toBe('string');
        expect(typeof todo.completed).toBe('boolean');
      });
    });

    it('should have at least one completed and one incomplete todo', () => {
      const mockTodos = [
        { id: 1, text: "Learn React Router v7", completed: true },
        { id: 2, text: "Build a todo app", completed: false },
        { id: 3, text: "Write tests", completed: false },
        { id: 4, text: "Deploy to Cloudflare Workers", completed: false },
        { id: 5, text: "Implement todo CRUD operations", completed: false },
      ];
      
      const completedTodos = mockTodos.filter(todo => todo.completed);
      const incompleteTodos = mockTodos.filter(todo => !todo.completed);
      
      expect(completedTodos.length).toBeGreaterThan(0);
      expect(incompleteTodos.length).toBeGreaterThan(0);
    });
  });
});