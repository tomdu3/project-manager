import { pb } from "@src/data/pocketbase";
import type { TypedPocketBase } from "@src/data/pocketbase-types";

export const isValidEmail = (email: string) => {
  if (typeof email !== "string") return false;
  if (email.length > 255) return false;
  const regex = /^.+@.+$/;
  return regex.test(email);
};

export const isValidPassword = (password: string) => {
  if (typeof password !== "string") return false;
  if (password.length > 255) return false;
  if (password.length < 4) return false;
  return true;
};

export function isValidData(email: string, password: string) {
  if (!isValidEmail(email)) {
    return false;
  }

  if (!isValidPassword(password)) {
    return false;
  }

  return true;
}

export async function createUser(email: string, password: string) {
  return await pb.collection("users").create({
    email: email,
    password: password,
    passwordConfirm: password,
    emailVisibility: true,
  });
}

export async function loginUser(email: string, password: string) {
  return await pb.collection("users").authWithPassword(email, password);
}

export function setCookieAndRedirectToDashboard() {
  return new Response(null, {
    status: 301,
    headers: {
      Location: "/app/dashboard",
      //set secure false on localhost for Safari compatibility
      "Set-Cookie": pb.authStore.exportToCookie({
        secure: import.meta.env.DEV ? false : true,
      }),
    },
  });
}

//   export async function isLoggedIn(request: Request) {
//   if (!request || !request.headers || !request.headers.get('Cookie')) {
//     return false;
//   }

//   pb.authStore.loadFromCookie(
//     request.headers.get('Cookie') || '',
//     'pb_auth'
//   );

//   try {
//     // Verify and refresh the auth model if valid
//     if (
//       pb.authStore.isValid &&
//       (await pb.collection('users').authRefresh())
//     ) {
//       return true;
//     }
//   } catch (error) {
//     // Clear auth store on refresh failure
//     pb.authStore.clear();
//     console.error("Auth refresh failed:", error);
//   }

//   return false;
// }

// export async function getUserUsername(request: Request) {
//   if (!request || !request.headers || !request.headers.get('Cookie')) {
//     return null;
//   }

//   pb.authStore.loadFromCookie(
//     request.headers.get('Cookie') || '',
//     'pb_auth'
//   );
//   return pb.authStore.model?.username || null;
// }

export async function isLoggedIn(request: Request) {
  if (!request || !request.headers || !request.headers.get("Cookie")) {
    return false;
  }

  pb.authStore.loadFromCookie(request.headers.get("Cookie") || "", "pb_auth");

  try {
    // Verify and refresh the auth model if valid
    if (pb.authStore.isValid && (await pb.collection("users").authRefresh())) {
      return true;
    }
  } catch (error) {
    // Clear auth store on refresh failure
    pb.authStore.clear();
    console.error("Auth refresh failed:", error);
  }

  return false;
}

export async function getUserUsername(request: Request) {
  if (!request || !request.headers || !request.headers.get("Cookie")) {
    return null;
  }

  pb.authStore.loadFromCookie(request.headers.get("Cookie") || "", "pb_auth");
  return pb.authStore.model?.username || null;
}

export async function sendResetPasswordLink(
  pb: TypedPocketBase,
  email: string
) {
  await pb.collection("users").requestPasswordReset(email);
}

