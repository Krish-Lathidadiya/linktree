"use server";

import connectDB from "@/libs/connect";
import Page from "@/models/Page";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

const handleFormSubmit = async (formData: FormData) => {
  const username = formData.get("username") as string | null;

  if (!username) {
    return { status: "error", message: "Username is required." };
  }

  try {
    await connectDB();

    // Check session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.error("No session or user email found.");
      return { status: "error", message: "User not authenticated." };
    }

    const existingPageDoc = await Page.findOne({ uri: username });

    if (existingPageDoc) {
      return {
        status: "error",
        message: "Username is already taken.",
        username,
      };
    } else {
      // Create new Page with owner field
      const newPage = await Page.create({
        uri: username,
        owner: session.user.email,
      });
      console.log("New Page created:", newPage);
      return { status: "success", redirectUrl: `/account?created=${username}` };
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    return { status: "error", message: "An error occurred during submission." };
  }
};

export default handleFormSubmit;
