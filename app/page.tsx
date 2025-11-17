'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [loading, setLoading] = useState(true);

    /**
     * コンポーネントマウント時にTODO一覧取得
     */
    useEffect(() => {
        fetchTodos();
    }, []);

    /**
     * TODO一覧取得
     */
    const fetchTodos = async () => {
        try {
            // TODO取得API呼び出し
            const response = await fetch('/api/todos');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * todo追加
     * @param e React.FormEvent
     */
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        // 空タイトルは追加しない
        if (!newTodoTitle.trim()) return;

        try {
            // TODO作成API呼び出し
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTodoTitle }),
            });

            // 成功時にTODO一覧更新
            if (response.status === 201) {
                const newTodo = await response.json();

                setTodos([newTodo, ...todos]);
                setNewTodoTitle('');
            }
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    }

    /**
     * todo完了状態切替
     * @param id 
     * @param completed 
     */
    const handleToggleTodo = async (id: string, completed: boolean) => {
        try {
            // TODO更新API呼び出し
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !completed }),
            });

            // 成功時にTODO一覧更新
            if (response.status === 200) {
                const updatedTodo = await response.json();
                setTodos(
                    todos.map((todo) => (todo.id === id ? updatedTodo : todo))
                );
            }

        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    }

    /**
     * todo削除
     * @param id 
     */
    const handleDeleteTodo = async (id: string) => {
        try {
            // TODO削除API呼び出し
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            // 成功時にTODO一覧更新
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    }

    // ローディング中表示
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // メインコンテンツ表示
    return (
        <div className="max-w-md mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Todo List</h1>

            {/* TODO追加フォーム */}
            <form onSubmit={handleAddTodo} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="新しいTODOを入力"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        追加
                    </button>
                </div>
            </form>

            {/* TODO一覧 */}
            <div className="space-y-2">
                {todos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        TODOがありません
                    </p>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() =>
                                    handleToggleTodo(todo.id, todo.completed)
                                }
                                className="w-5 h-5 cursor-pointer"
                            />
                            <span
                                className={`flex-1 ${
                                    todo.completed
                                        ? 'line-through text-gray-400'
                                        : 'text-gray-800'
                                }`}
                            >
                                {todo.title}
                            </span>
                            <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                                削除
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
