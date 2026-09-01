import { Href, useRouter } from "expo-router";

let isNavigating = false;

function normalizePath(path: string): string {
  // Remove layout segments like /(default-bg) /(parent-bg)
  return path.replace(/\(.*?\)\//g, "/");
}

function getTargetPath(target: Href): string {
  const rawPath =
    typeof target === "string"
      ? target.split("?")[0]
      : target.pathname;

  return normalizePath(rawPath);
}


export function safeNavigate(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  target: Href,
  mode: "push" | "replace" = "push"
) {
  const targetPath = getTargetPath(target);

  // 1️⃣ Already on same route → do nothing
  if (pathname === targetPath) return;


  // Prevent double-tap / race condition
  if (isNavigating) return;

  isNavigating = true;
  mode === "replace"
    ? router.replace(target)
    : router.push(target)

  // Release lock after navigation settles
  setTimeout(() => {
    isNavigating = false;
  }, 50);
}
