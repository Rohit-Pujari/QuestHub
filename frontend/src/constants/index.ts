import {
  faHome,
  faMessage,
  faUserAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { title } from "process";

interface SideBarItem {
  title: string;
  icon: IconDefinition;
  link: string;
}
export const SideBarItems = [
  {
    title: "Home",
    icon: faHome,
    link: "/",
  },
  {
    title: "Profile",
    icon: faUserAlt,
    link: "/profile",
  },
  {
    title: "Messages",
    icon: faMessage,
    link: "/message",
  },
];
