"use client";
import React, { ChangeEvent, useState } from "react";
import { IPage } from "@/models/Page";
import RadioTogglers from "../formItems/RadioTogglers";
import { Session } from "next-auth";
import Image from "next/image";
import { ProfileIcon, SaveIcon } from "../../../public/icons";
import { savepageSettings } from "@/actions/pageActions";
import toast from "react-hot-toast";
import SectionBox from "../layout/SectionBox";

function PageSettingForm({
  page,
  session,
}: {
  page: IPage;
  session: Session | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [bgType, setBgType] = useState(page.bgType);
  const [bgColor, setBgColor] = useState(page.bgColor);
  const [bgImage, setBgImage] = useState(page.bgImage);
  const [avatar, setAvatar] = useState<string | null>(
    session?.user?.image || null
  );
  async function saveBaseSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);

    // Add fileUrl and ExistedFileUrl to FormData
    formData.append("bgImage", bgImage);
    formData.append("existedFileUrl", page.bgImage);
    formData.append("avatar", avatar as string);
    formData.append("existedAvataUrl", session?.user?.image as string);

    try {
      const result = await savepageSettings(formData);
      if (result) {
        toast.success("Settings saved");
      } else {
        toast.error("Saving failed");
      }
    } catch (error) {
      toast.error("Error occurred while saving.");
    }
    setLoading(false);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setBgImage(url);
    };
    reader.readAsDataURL(file);
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatar(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <SectionBox>
        <form onSubmit={saveBaseSettings}>
          {/* Background Selection Section */}
          <div
            className="-m-4 py-4 min-h-[300px] flex justify-center items-center bg-cover bg-center"
            style={
              bgType === "color"
                ? { backgroundColor: bgColor }
                : { backgroundImage: `url(${bgImage})` }
            }
          >
            <div>
              <RadioTogglers
                defaultValue={bgType}
                options={[
                  { value: "color", icon: "ColorPaletteIcon", label: "Color" },
                  { value: "image", icon: "ImageIcon", label: "Image" },
                ]}
                onChange={setBgType}
              />
              {bgType === "color" && (
                <div className="bg-gray-200 shadow text-gray-700 p-2 mt-2">
                  <div className="mt-2 flex justify-center gap-2">
                    <input
                      type="color"
                      name="bgColor"
                      defaultValue={page.bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                    <span>Background color</span>
                  </div>
                </div>
              )}
              {bgType === "image" && (
                <div className="flex justify-center">
                  <label className="bg-white shadow px-4 py-2 mt-2">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading}
                    />
                    Change image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex justify-center items-center">
            {avatar ? (
              <div className="relative -top-8">
                <Image
                  className="rounded-full border-4 border-white shadow-lg shadow-black/50"
                  src={avatar}
                  alt="avatar"
                  width={128}
                  height={128}
                />
                <label className="absolute -right-2 -bottom-2 bg-white p-2 rounded-full shadow shadow-black/50 flex gap-1 items-center aspect-square cursor-pointer">
                  <ProfileIcon className="h-5 w-5 cursor-pointer" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleIconChange}
                  />
                </label>
              </div>
            ) : (
              <div className="bg-gray-400 w-32 h-32 rounded-full flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="user-info p-0">
            <label htmlFor="nameIn">Display name</label>
            <input
              type="text"
              placeholder="John Doe"
              name="displayName"
              defaultValue={page.displayName}
              className="focus:outline-none focus:ring-2 ring-blue-400"
            />
            <label htmlFor="LocationIn">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Somewhere in the world"
              defaultValue={page.location}
              className="focus:outline-none focus:ring-2 ring-blue-400"
            />
            <label htmlFor="bioIn">Bio</label>
            <textarea
              name="bio"
              placeholder="Your bio goes here..."
              defaultValue={page.bio}
              className="focus:outline-none focus:ring-2 ring-blue-400"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="max-w-[200px] ml-auto flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:text-gray-200 bg-blue-500 hover:bg-blue-600 w-full text-white py-2 px-4"
            >
              <SaveIcon />
              Save
            </button>
          </div>
        </form>
      </SectionBox>
    </div>
  );
}

export default PageSettingForm;
