import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateTodoInput } from "@/types/todo";

/** 
 * GET /api/todos
 * TODO一覧取得
 */
export async function GET() {
    try {
        // TODO一覧取得
        const todos = await prisma.todo.findMany({
            orderBy: { createdAt: "desc" }
        });

        // レスポンス todo一覧
        return NextResponse.json(todos);
    } catch (error) {
        // エラーログ出力
        console.error(error);

        // 失敗レスポンス
        return NextResponse.json(
            {error: "Failed to fetch todos"}, 
            {status: 500}
        );
    }
}

/**
 * POST /api/todos
 * TODO新規作成
 */
export async function POST(request: Request) {
    try {
        // リクエストボディ取得
        const body: CreateTodoInput = await request.json();

        // Validate input
        if(!body.title) {
            return NextResponse.json(
                {error: "Title is required"},
                {status: 400}
            );
        }

        // 新規作成
        const todo = await prisma.todo.create({
            data: {
                title: body.title,
            },
        });

        // 成功レスポンス
        return NextResponse.json(todo, {status: 201});
    } catch (error) {
        // エラーログ出力
        console.error(error);

        // 失敗レスポンス
        return NextResponse.json(
            {error: "Failed to create todo"},
            {status: 500}
        );
    }
}
