export type FriendLink = {
  name: string;
  description: string;
  url: string;
  initials: string;
  avatar?: string;
  tone: "mint" | "coral" | "blue" | "yellow";
};

export const friends: FriendLink[] = [
  {
    name: "lvy-neko",
    description: "让我萌生搭建个人博客念头的个人站点。",
    url: "https://lvyovo-wiki.tech/",
    initials: "LV",
    avatar: "https://lvyovo-wiki.tech/images/avatar.png",
    tone: "mint",
  },
];