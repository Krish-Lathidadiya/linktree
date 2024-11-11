import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { redirect, useSearchParams } from "next/navigation"; // useSearchParams is the key
import UsernameForm from "@/components/forms/UsernameForm";
import Page from "@/models/Page";
import connectDB from "@/libs/connect";
import PageSettingForm from "@/components/forms/PageSettingForm";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinkForm from "@/components/forms/PageLinkForm";

async function AccountPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  // Fetch the page data for the authenticated user
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

  // Access query parameters using useSearchParams on the client side
  const searchParams = useSearchParams();
  const desiredUsername = searchParams?.get('desiredUsername') || "";

  return (
    <div>
      <UsernameForm desiredUsername={desiredUsername} />
    </div>
  );
}

export default AccountPage;
