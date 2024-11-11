import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import UsernameForm from "@/components/forms/UsernameForm";
import Page from "@/models/Page";
import connectDB from "@/libs/connect";
import PageSettingForm from "@/components/forms/PageSettingForm";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinkForm from "@/components/forms/PageLinkForm";

// Removed the unnecessary `AccountPageProps` constraint.
async function AccountPage({
  searchParams,
}: {
  searchParams: { desiredUsername?: string };
}) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  try {
    await connectDB();
    const page = await Page.findOne({ owner: session?.user?.email });
    if (page) {
      return (
        <>
          <PageSettingForm page={page} session={session} />
          <PageButtonsForm page={page} />
          <PageLinkForm page={page} />
        </>
      );
    }
  } catch (error) {
    console.error("Error fetching page data:", error);
    return <div>Failed to load account details. Please try again later.</div>;
  }

  const desiredUsername = searchParams?.desiredUsername || "";

  return (
    <div>
      <UsernameForm desiredUsername={desiredUsername} />
    </div>
  );
}

export default AccountPage;
