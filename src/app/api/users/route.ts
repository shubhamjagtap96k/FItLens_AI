import { NextRequest, NextResponse } from "next/server";
import { UserRepository, CreateUserInput } from "@/lib/db/user-repository";

export async function POST(req: NextRequest) {
  try {
    const body: CreateUserInput = await req.json();

    // Basic Validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and Email are required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create user and profile in DB
    const result = await UserRepository.createUser(body);

    return NextResponse.json(
      {
        success: true,
        message: `User '${result.user.name}' successfully saved in ${result.storageSource} Database!`,
        source: result.storageSource,
        data: result.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user in database", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await UserRepository.getAllUsers();
    return NextResponse.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}
