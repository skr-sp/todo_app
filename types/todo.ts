export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateTodoInput = {
    title:      string;
};

export type UpdateTodoInput = {
    title?:      string;
    completed?: boolean;
};
