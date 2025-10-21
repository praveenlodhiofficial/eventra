export type UserSession = {
   id: string;
   role: string;
};

export type CookieOptions = {
   secure?: boolean;
   httpOnly?: boolean;
   sameSite?: "strict" | "lax";
   expires?: number;
};

export type Cookies = {
   set: (key: string, value: string, options: CookieOptions) => void;
   get: (key: string) => { name: string; value: string } | undefined;
   delete: (key: string) => void;
};
