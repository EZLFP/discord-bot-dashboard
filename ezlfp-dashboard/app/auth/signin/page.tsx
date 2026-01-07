import { signIn } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">EZLFP Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access the dashboard
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-[#5865F2] px-4 py-3 font-semibold text-white hover:bg-[#4752C4] transition-colors"
          >
            Sign in with Discord
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Only server admins and moderators can access this dashboard
        </p>
      </div>
    </div>
  );
}
