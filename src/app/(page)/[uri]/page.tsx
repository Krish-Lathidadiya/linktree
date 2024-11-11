import connectDB from "@/libs/connect";
import Page, { IPage } from "@/models/Page";
import User, { IUser } from "@/models/User";
import Image from "next/image";
import React from "react";
import { LocationIcon } from "../../../../public/icons";
import Link from "next/link";
import DynamicIcon from "@/utils/DynamicIcon";
import { TLinks } from "@/components/forms/PageLinkForm";
import Event from "@/models/Event";
import axios from "axios";

export const buttonsIcons: Record<
  string,
  { iconName: string; library: "fa" | "md" | "ai" }
> = {
  email: { iconName: "FaEnvelope", library: "fa" },
  mobile: { iconName: "FaMobileAlt", library: "fa" },
  instagram: { iconName: "FaInstagram", library: "fa" },
  facebook: { iconName: "FaFacebook", library: "fa" },
  discord: { iconName: "FaDiscord", library: "fa" },
  tiktok: { iconName: "FaTiktok", library: "fa" },
  youtube: { iconName: "FaYoutube", library: "fa" },
  whatsapp: { iconName: "FaWhatsapp", library: "fa" },
  gitHub: { iconName: "FaGithub", library: "fa" },
};

function buttonLink(key: string, value: string) {
  if (key === "mobile") {
    return "tel:" + value;
  }
  if (key === "email") {
    return "mailto:" + value;
  }
  return value;
}

async function UserPage({ params }: { params: { uri: string } }) {
  const { uri } = await params;
  let page: IPage | null = null;
  let user: IUser | null = null;

  try {
    await connectDB();

    // Fetch the page by uri
    page = await Page.findOne({ uri });

    if (!page) {
      return <div>Page not found</div>;
    }

    user = await User.findOne({ email: page.owner });

    if (!user) {
      return <div>User not found</div>;
    }
  } catch (error) {
    console.error("Error fetching page or user:", error);
    return <div>Error loading page</div>;
  }

  await Event.create({ uri: uri, type: "view" });
  async function handleLinkClick(url: string) {
    try {
      await axios.post(`/api/click?uri=${btoa(url)}`);
    } catch (error) {
      console.error("Error logging click event:", error);
    }
  }
  return (
    <div className="bg-blue-950 text-white min-h-screen">
      {/* Header Section */}
      <div
        className="h-36 flex justify-center items-center bg-cover bg-center"
        style={
          page.bgType === "color"
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }
      ></div>

      {/* Avatar Section */}
      <div className="aspect-square flex justify-center items-center w-36 h-36 mx-auto relative -top-20 -mb-16">
        <Image
          className="rounded-full border-4 border-white shadow-lg shadow-black/50"
          src={user.image}
          alt="avatar"
          width={128}
          height={128}
        />
      </div>

      {/* Page user-info */}
      <div className="flex flex-col justify-center items-center gap-3">
        <div>
          <h2 className="text-lg text-center font-semibold mb-1">
            {page.displayName}
          </h2>
          <h3 className="flex items-center gap-2 text-md text-white/70">
            <LocationIcon />
            <span>{page.location}</span>
          </h3>
        </div>
        <div className="max-w-xs mx-auto text-center ">
          <p>{page.bio}</p>
        </div>
      </div>

      {/* Buttons sections */}
      <div className="mt-5 flex gap-2 justify-center flex-wrap pb-4">
        {Object.keys(page.buttons).map((buttonKey) => {
          const { iconName, library } =
            buttonsIcons[buttonKey.toLowerCase()] || {};

          if (!iconName || !library) {
            console.warn(`Icon not found for key: ${buttonKey}`);
            return null;
          }

          return (
            <Link
              key={buttonKey}
              href={buttonLink(buttonKey, page.buttons[buttonKey])}
              className="rounded-full bg-white text-blue-950 flex items-center justify-center border-white p-2"
            >
              <div className="flex items-center gap-2">
                <DynamicIcon
                  iconName={iconName}
                  library={library}
                  className="text-base"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* link section */}
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {Array.isArray(page.links) &&
          page.links.map((link: TLinks) => (
            <Link
            target="_blank"
              ping={`/api/click?uri=${btoa(link.url)}`}
              key={link.id}
              href={link.url || "/"}
              className="bg-indigo-800 p-2 flex"
            >
              <div className="relative  -left-4 overflow-hidden w-16">
                <div className=" w-16 h-16 bg-blue-700 aspect-square relative flex items-center justify-center grow ">
                  {link.icon ? (
                    <Image
                      src={link.icon}
                      alt="link icon"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <DynamicIcon
                      iconName="FaLink"
                      library="fa"
                      className="text-white w-8 h-8 "
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center shrink grow-0 overflow-hidden">
                <h3 className="text-white font-semibold">{link.title}</h3>
                <p className="text-white/50 overflow-hidden">{link.subTitle}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default UserPage;
