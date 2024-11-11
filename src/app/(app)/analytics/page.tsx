import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageViewLineChart from "@/components/charts/PageViewLineChart";
import PageViewPieChart from "@/components/charts/PageViewPieChart";
import { TLinks } from "@/components/forms/PageLinkForm";
import SectionBox from "@/components/layout/SectionBox";
import connectDB from "@/libs/connect";
import Event from "@/models/Event";
import Page from "@/models/Page";
import DynamicIcon from "@/utils/DynamicIcon";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { startOfDay, endOfDay } from "date-fns";

interface LinkClickData {
  url: string;
  allTimeClickCount: number;
  todayClickCount: number;
}

const AnalyticsPage = async () => {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }

  const page = await Page.findOne({ owner: session.user?.email });
  if (!page) {
    return <div>No page found</div>;
  }

  const viewCount = await Event.countDocuments({
    type: "view",
    uri: page.uri,
  });

  let clickCounts: LinkClickData[] = [];

  const allLinks: TLinks[] = Array.isArray(page.links) ? page.links : [];
  clickCounts = await Promise.all(
    allLinks.map(async (link: TLinks) => {
      if (!link.url) {
        return { url: "Unknown", allTimeClickCount: 0, todayClickCount: 0 };
      }

      // All-time click count
      const allTimeClickCount = await Event.countDocuments({
        type: "click",
        uri: link.url,
      });

      // Today click count
      const startOfToday = startOfDay(new Date());
      const endOfToday = endOfDay(new Date());
      const todayClickCount = await Event.countDocuments({
        type: "click",
        uri: link.url,
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      });

      return { url: link.url, allTimeClickCount, todayClickCount };
    })
  );

  const groupedViews = await Event.aggregate([
    {
      $match: { type: "view", uri: page.uri },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d",
          },
        },
        count: {
          $count: {},
        },
      },
    },
  ]);

  console.log({groupedViews});

  return (
    <div className="p-6">
      <SectionBox>
        <h2 className="text-3xl font-bold text-center mb-8">Analytics</h2>

        {/* Views Section */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <h3 className="text-2xl font-semibold">Page Views</h3>
          <p className="text-lg text-center">Total Views: {viewCount}</p>
          <PageViewLineChart groupedViews={groupedViews} />
          <PageViewPieChart groupedViews={groupedViews} />
        </div>
      </SectionBox>

      {/* Links List */}
      <SectionBox>
        <div>
          <h3 className="text-2xl font-semibold text-center mb-6">
            Link Clicks
          </h3>
          {Array.isArray(page.links) ? (
            page.links.map((link: TLinks) => {
              // Find the click count for the link
              const clickData = clickCounts.find((c) => c.url === link.url);
              const allTimeClicks = clickData ? clickData.allTimeClickCount : 0;
              const todayClicks = clickData ? clickData.todayClickCount : 0;

              return (
                <div
                  className="md:flex items-center gap-6 border-t border-gray-200 py-4"
                  key={link.url}
                >
                  <div className="text-blue-500">
                    <DynamicIcon iconName="FaLink" library="fa" />
                  </div>
                  <div className="grow">
                    <h3>{link.title || "no title"}</h3>
                    <p className="text-gray-500 text-sm">
                      {link.subTitle || "no description"}
                    </p>
                    <a
                      className="text-sm text-blue-400"
                      target="_blank"
                      href={link.url}
                    >
                      {link.url}
                    </a>
                  </div>
                  {/*   Click today: */}
                  <div className="text-center">
                    <div className="border rounded-md p-2">
                      <div className="text-2xl">{todayClicks}</div>
                      <div className="text-gray-400 text-xs uppercase font-bold">
                        Click today:
                      </div>
                    </div>
                  </div>
                  {/*   Click total: */}
                  <div className="text-center mt-1 md:mt-0">
                    <div className="border rounded-md p-2">
                      <div className="text-2xl">{allTimeClicks}</div>
                      <div className="text-gray-400 text-xs uppercase font-bold">
                        Click total:
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No links available</p>
          )}
        </div>
      </SectionBox>
    </div>
  );
};

export default AnalyticsPage;
