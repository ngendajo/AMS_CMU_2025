import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as TfiIcons from "react-icons/tfi";
import * as HiIcons from "react-icons/hi";
import * as FaIcons from "react-icons/fa";
 
export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiOutlineHome />,
      },
      {
        title: "Events",
        path: "/events",
        icon: <MdIcons.MdEmojiEvents />,
      },
      {
        title: "Networks",
        path: "/chats",
        icon: <GiIcons.GiConversation />,
      },
      {
        title: "Opportunities",
        path: "/opportunities",
        icon: <MdIcons.MdSensorOccupied />,
      },
      {
        title: "Schedule",
        path: "/schedule",
        icon: <AiIcons.AiOutlineSchedule />,
      },
      {
        title: "Gallery",
        path: "/gallery",
        icon: <TfiIcons.TfiGallery />,
      },
  {
    title: "Users",
    path: "/alumni",
    icon: <HiIcons.HiOutlineUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
 
    subNav: [
      {
        title: "Alumni",
        path: "/alumni",
        icon: <FaIcons.FaUserGraduate />,
      },
      {
        title: "Staff",
        path: "/staff",
        icon: <RiIcons.RiAdminFill />,
      },
    ],
  },
  {
    title: "Help Center",
    path: "/help",
    icon: <IoIcons.IoMdHelpCircle />,
  },
];
export const SidebarDataforAlumn = [
  {
      title: "Home",
      path: "/",
      icon: <AiIcons.AiOutlineHome />,
    },
    {
      title: "Events",
      path: "/events",
      icon: <MdIcons.MdEmojiEvents />,
    },
    /* {
      title: "Networks",
      path: "/chats",
      icon: <GiIcons.GiConversation />,
    }, */
    {
      title: "Opportunities",
      path: "/opportunities",
      icon: <MdIcons.MdSensorOccupied />,
    },
    {
      title: "Schedule",
      path: "/schedule",
      icon: <AiIcons.AiOutlineSchedule />,
    },
    {
      title: "Gallery",
      path: "/gallery",
      icon: <TfiIcons.TfiGallery />,
    },
/* {
  title: "Users",
  path: "/alumni",
  icon: <HiIcons.HiOutlineUsers />,
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,

  subNav: [
    {
      title: "Alumni",
      path: "/alumni",
      icon: <FaIcons.FaUserGraduate />,
    },
    {
      title: "Staff",
      path: "/staff",
      icon: <RiIcons.RiAdminFill />,
    },
  ],
}, */
{
  title: "Help Center",
  path: "/help",
  icon: <IoIcons.IoMdHelpCircle />,
},
];