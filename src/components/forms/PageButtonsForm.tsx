"use client";

import React, { FormEvent, useState } from "react";
import SectionBox from "../layout/SectionBox";
import { IPage } from "@/models/Page";
import { Session } from "next-auth";
import { GripLinesIcon, PlusIcon, SaveIcon, TrashIcon } from "../../../public/icons";
import { savePageButtons } from "@/actions/pageActions";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import DynamicIcon from "@/utils/DynamicIcon";

export const allButtons: Array<{
  key: string;
  label: string;
  iconName: string;
  library: "fa" | "md" | "ai";
  placeholder?: string;
}> = [
  {
    key: "email",
    label: "e-mail",
    iconName: "FaEnvelope",
    library: "fa",
    placeholder: "test@gmail.com",
  },
  {
    key: "mobile",
    label: "mobile",
    iconName: "FaMobileAlt",
    library: "fa",
    placeholder: "+91 123 123 123",
  },
  {
    key: "instagram",
    label: "instagram",
    iconName: "FaInstagram",
    library: "fa",
    placeholder: "https://instagram.com/profile/...",
  },
  { key: "facebook", label: "facebook", iconName: "FaFacebook", library: "fa" },
  { key: "discord", label: "discord", iconName: "FaDiscord", library: "fa" },
  { key: "tiktok", label: "tiktok", iconName: "FaTiktok", library: "fa" },
  { key: "youtube", label: "youtube", iconName: "FaYoutube", library: "fa" },
  { key: "whatsapp", label: "whatsapp", iconName: "FaWhatsapp", library: "fa" },
  { key: "gitHub", label: "gitHub", iconName: "FaGithub", library: "fa" },
];

const upperFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

function PageButtonsForm({
  page,
  session,
}: {
  page: IPage;
  session: Session | null;
}) {
  type ButtonType = {
    id: string;
    key: string;
    label: string;
    iconName: string;
    library: "fa" | "md" | "ai";
    placeholder?: string;
  };

  const pageSaveButtonsKeys = Object.keys(page.buttons);
  const pageSavedButtonsInfo: ButtonType[] = pageSaveButtonsKeys
    .map((key) => {
      const button = allButtons.find((button) => button.key === key);
      if (button) {
        return { ...button, id: button.key };
      }
      return null;
    })
    .filter((button): button is ButtonType => button !== null);

  const [activeButtons, setActiveButtons] = useState<ButtonType[]>(pageSavedButtonsInfo);

  // add button in id and set in active buttons
  const addButtonToProfile = (button: {
    key: string;
    label: string;
    iconName: string;
    library: "fa" | "md" | "ai"; 
    placeholder?: string;
  }) => {
    const buttonWithId = { ...button, id: button.key };
    if (!activeButtons.some((activeButton) => activeButton.key === buttonWithId.key)) {
      setActiveButtons((prev) => [...prev, buttonWithId]);
    }
  };
  

  const availableButtons = allButtons.filter(
    (button) => !activeButtons.some((activeButton) => activeButton.key === button.key)
  );

  const saveButtons = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const result = await savePageButtons(formData);
    if (result) {
      toast.success("Saved");
    } else {
      toast.error("Failed to save");
    }
  };

  const removeButton = (
    button: ButtonType,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setActiveButtons((prev) =>
      prev.filter((activeButton) => activeButton.key !== button.key)
    );
  };

  return (
    <SectionBox>
      <form onSubmit={saveButtons}>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <ReactSortable list={activeButtons} setList={setActiveButtons}>
          {activeButtons.map((button) => (
            <div className="mb-4 flex items-center" key={button.id}>
              <div className="w-36 flex p-2 gap-2 items-center text-gray-700">
                <GripLinesIcon className="cursor-pointer text-gray-400" />
                <DynamicIcon
                  iconName={button.iconName}
                  library={button.library}
                  className="text-xl"
                />
                <span>{upperFirst(button.label)}:</span>
              </div>
              <input
                type="text"
                className="p-2 bg-gray-100 focus:outline-none focus:ring-2 ring-blue-400"
                name={button.key}
                placeholder={button.placeholder || ""}
                value={page.buttons[button.key] || ""}
              />
              <button
                className="bg-gray-300 py-3 px-2 cursor-pointer text-red-500"
                onClick={(e) => removeButton(button, e)}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </ReactSortable>

        <div className="flex gap-2 flex-wrap mt-8 border-y py-4">
          {availableButtons.map((button) => (
            <button
              key={button.key}
              className="flex items-center gap-1 p-2 bg-gray-200"
              onClick={() => addButtonToProfile(button)}
            >
              <DynamicIcon
                iconName={button.iconName}
                library={button.library}
                className="text-xl"
              />
              <span>{upperFirst(button.label)}</span>
              <PlusIcon />
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto mt-8">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 w-full text-white py-2 px-4"
          >
            <SaveIcon />
            <span>Save</span>
          </button>
        </div>
      </form>
    </SectionBox>
  );
}

export default PageButtonsForm;
