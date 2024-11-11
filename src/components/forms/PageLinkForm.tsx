"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import SectionBox from "../layout/SectionBox";
import { Session } from "next-auth";
import { IPage } from "@/models/Page";
import {
  ExchangeIcon,
  GripLinesIcon,
  LinkIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
} from "../../../public/icons";
import { ReactSortable } from "react-sortablejs";
import { savePageLinks } from "@/actions/pageActions";
import toast from "react-hot-toast";

export type TLinks = {
  id: string;
  title: string;
  subTitle: string;
  icon: string;
  url: string;
  createdAt?:string;
};
function PageLinkForm({
  page,
  session,
}: {
  page: IPage;
  session: Session | null;
}) {
  const [links, setLinks] = useState<TLinks[]>(
    Array.isArray(page.links) ? page.links : []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const saveLinkForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await savePageLinks(links);
      if (result) {
        toast.success("Saved");
      } else {
        toast.error("Failed to save");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        subTitle: "",
        icon: "",
        url: "",
      },
    ]);
  };

  const handleIconFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    linkId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === linkId ? { ...link, icon: url } : link
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleLinkChange = (
    linkId: string,
    field: "title" | "subTitle" | "url",
    value: string
  ) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link
      )
    );
  };

  const removeLink = (linkID: string) => {
    setLinks((previousLinks) => {
      return previousLinks.filter((link) => link.id !== linkID);
    });
  };

  return (
    <SectionBox>
      <form onSubmit={saveLinkForm}>
        <h2 className="text-2xl font-bold mb-4">Links</h2>
        <button
          type="button"
          onClick={addNewLink}
          className="flex gap-2 items-center cursor-pointer text-blue-500 text-lg "
        >
          <PlusIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" />
          <span>Add new</span>
        </button>
        <div className="">
          <ReactSortable list={links} setList={setLinks}>
            {links.map((l) => (
              <div key={l.id} className="mt-8 flex gap-4 items-center">
                {/* Grip Icon */}
                <div className="cursor-pointer">
                  <GripLinesIcon className="text-gray-700 mr-2" />
                </div>
                {/* Icon */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-gray-200 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                    {l.icon ? (
                      <img
                        src={l.icon}
                        alt="icon"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <LinkIcon className="text-gray-500 w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <input
                      id={"icon" + l.id}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleIconFileChange(e, l.id)}
                    />
                    <label
                      htmlFor={"icon" + l.id}
                      className="inline-block sm:flex gap-2 items-center justify-center rounded-md text-gray-600 border p-2 cursor-pointer"
                    >
                      <ExchangeIcon />
                      <span className="hidden sm:block">Change icon</span>
                    </label>
                  </div>
                  {/* Trash button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeLink(l.id)}
                      className="flex items-center bg-gray-300 p-2 gap-2 justify-center"
                    >
                      <TrashIcon />
                      <span className="hidden sm:block">Remove this link</span>
                    </button>
                  </div>
                </div>

                {/* Link inputs */}
                <div className="grow space-y-2">
                  <label className="link-label">Title:</label>
                  <input
                    type="text"
                    value={l.title}
                    onChange={(e) =>
                      handleLinkChange(l.id, "title", e.target.value)
                    }
                    name={`title-${l.id}`}
                    placeholder="title"
                    className="p-2 bg-gray-100 w-full focus:outline-none focus:ring-2 ring-blue-400"
                  />
                  <label className="link-label">SubTitle:</label>
                  <input
                    type="text"
                    value={l.subTitle}
                    onChange={(e) =>
                      handleLinkChange(l.id, "subTitle", e.target.value)
                    }
                    name={`subTitle-${l.id}`}
                    placeholder="subtitle (optional)"
                    className="p-2 bg-gray-100 w-full focus:outline-none focus:ring-2 ring-blue-400"
                  />
                  <label className="link-label">Url:</label>
                  <input
                    type="text"
                    value={l.url}
                    onChange={(e) =>
                      handleLinkChange(l.id, "url", e.target.value)
                    }
                    name={`url-${l.id}`}
                    placeholder="url"
                    className="p-2 bg-gray-100 w-full focus:outline-none focus:ring-2 ring-blue-400"
                  />
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        <div className="border-t pt-4 mt-4">
          <button
            disabled={loading}
            type="submit"
            className="max-w-xs mx-auto
        flex items-center justify-center gap-2 disabled:bg-blue-300 bg-blue-500 hover:bg-blue-600 w-full text-white py-2 px-4"
          >
            <SaveIcon />
            <span>Save</span>
          </button>
        </div>
      </form>
    </SectionBox>
  );
}

export default PageLinkForm;
