import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {UpdateTodoInput} from "@/types/todo";

/**
 * PATCH /api/todos/:id
 * TODO更新
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // リクエストボディ取得
        const body: UpdateTodoInput = await request.json();

        // TODO更新
        const todo = await prisma.todo.update({
            where: {
                id: id
            },
            data: {
                completed: body.completed
            }
        });

        // 成功レスポンス
        return NextResponse.json(todo, {status: 200});
    } catch(error){
        // エラーログ出力
        console.error(error);

        // 失敗レスポンス
        return NextResponse.json(
            {error: "Failed to update todo"},
            {status: 500}
        );
    }
}

/**
 * DELETE /api/todos/:id
 * TODO削除
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // パラメータ取得
        const { id } = await params;

        // TODO削除
        await prisma.todo.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // エラーログ出力
        console.error(error);

        // 失敗レスポンス
        return NextResponse.json(
            {error: "Failed to delete todo"},
            {status: 500}
        );
    }
}
