"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TLinks } from "@/components/forms/PageLinkForm";
import connectDB from "@/libs/connect";
import Page from "@/models/Page";
import User from "@/models/User";
import cloudinary from "@/utils/cloudinary";
import { getServerSession } from "next-auth";

export async function savepageSettings(formData: FormData): Promise<boolean> {
  try {
    // Connect to the database
    await connectDB();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) return false;

    // Retrieve the user's page
    const page = await Page.findOne({ owner: session.user?.email });
    if (!page) return false;

    // Extract form data
    const displayName = formData.get("displayName") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    const bgType = formData.get("bgType") as string;
    const bgColor = formData.get("bgColor") as string;
    const bgImage = formData.get("bgImage") as string;
    const ExistedFileUrl = formData.get("existedFileUrl") as string;
    const avatar = formData.get("avatar") as string;
    const ExistedAvataUrl = formData.get("existedAvataUrl") as string;

    // Handle background image update if necessary
    if (bgImage && bgImage !== ExistedFileUrl) {
      const uploadResult = await cloudinary.v2.uploader.upload(bgImage, {
        folder: "uploadedFile",
      });
      const newBgImageUrl = uploadResult.secure_url;
      await Page.updateOne(
        { owner: session.user?.email },
        { displayName, location, bio, bgType, bgColor, bgImage: newBgImageUrl }
      );
    }
    // Handle avatar update if necessary
    else if (avatar && avatar !== ExistedAvataUrl) {
      const uploadResult = await cloudinary.v2.uploader.upload(avatar, {
        folder: "profile_pictures",
      });
      const newAvatarUrl = uploadResult.secure_url;
      await User.updateOne(
        { email: session.user?.email },
        { image: newAvatarUrl }
      );
    }
    // Update other page fields if no new image is uploaded
    else {
      await Page.updateOne(
        { owner: session.user?.email },
        { displayName, location, bio, bgType, bgColor }
      );
    }

    return true;
  } catch (error) {
    console.error("Error saving page settings:", error);
    return false;
  }
}

export async function savePageButtons(formData: FormData): Promise<boolean> {
  try {
    connectDB();

    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) return false;

    // Retrieve the user's page
    const page = await Page.findOne({ owner: session.user?.email });
    if (!page) return false;

    const buttonValues: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      buttonValues[key] = value;
    });

    await Page.updateOne(
      { owner: session.user?.email },
      { buttons: buttonValues }
    );
    return true;
  } catch (error) {
    console.error("Error saving page buttons:", error);
    return false;
  }
}

async function isIconUploaded(iconUrl: string): Promise<boolean> {
  try {
    const result = await cloudinary.v2.api.resources({
      public_ids: [iconUrl],
    });

    console.log("isIconUploaded result: " + result.resources);
    return result.resources && result.resources.length > 0;
  } catch (error) {
    console.error("Error checking Cloudinary icon:", error);
    return false;
  }
}

export async function savePageLinks(links: TLinks[]): Promise<boolean> {
  try {
    await connectDB();
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) return false;

    // Retrieve the user's page
    const page = await Page.findOne({ owner: session.user?.email });
    if (!page) return false;

    // Process the links with asynchronous icon upload
    const updatedLinks = await Promise.all(
      links.map(async (l) => {
        let newIcon = l.icon;

        // If an icon exists and it's not already uploaded, upload it to Cloudinary
        if (l.icon && !(await isIconUploaded(l.icon))) {
          console.log("icon uploaded on cloudinary");
          const uploadResult = await cloudinary.v2.uploader.upload(l.icon, {
            folder: "profile_pictures",
          });
          newIcon = uploadResult.secure_url;
        }
        // Return the updated link with the new icon URL
        return { ...l, icon: newIcon };
      })
    );

    // If there are links, update the user's page with the new links
    if (updatedLinks.length > 0) {
      await Page.updateOne(
        { owner: session.user?.email },
        { links: updatedLinks }
      );
    }

    return true;
  } catch (error) {
    console.error("Error saving page links:", error);
    return false;
  }
}
