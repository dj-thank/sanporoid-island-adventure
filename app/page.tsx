import { TripBoard } from "./TripBoard";
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
} from "./chatgpt-auth";

export default async function Home() {
  const user = await getChatGPTUser();

  return (
    <TripBoard
      viewer={user ? { displayName: user.displayName } : null}
      signInPath={chatGPTSignInPath("/#add")}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
