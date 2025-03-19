import {
  faAdd,
  faHome,
  faMessage,
  faUserAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface SideBarItem {
  title: string;
  icon: IconDefinition;
  link: string;
}
export const SideBarItems: SideBarItem[] = [
  {
    title: "Home",
    icon: faHome,
    link: "/",
  },
  {
    title: "create post",
    icon: faAdd,
    link: "/post/create-post",
  },
  {
    title: "Messages",
    icon: faMessage,
    link: "/message",
  },
];
