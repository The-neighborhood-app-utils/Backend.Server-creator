/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.elaborate.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.elaborate.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Handlers from "views/Handlers/Handlers.js";
import Configs from "views/Configs/Configs.js";
import Clients from "views/Clients/Clients.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
import PanToolIcon from '@material-ui/icons/PanTool';
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ListAltIcon from '@material-ui/icons/ListAlt';
const dashboardRoutes = [
  {
    path: "/services_list",
    name: "Services list",
    rtlName: "?????????? ????????????",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/create_service",
    name: "Create service",
    rtlName: "?????? ???????????? ????????????????",
    icon: SettingsApplicationsIcon,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/create_handler",
    name: "Create handler",
    rtlName: "?????? ???????????? ????????????????",
    icon: PanToolIcon,
    component: Handlers,
    layout: "/admin"
  },
  {
    path: "/create_client",
    name: "Create client",
    rtlName: "?????? ???????????? ????????????????",
    icon: EmojiEmotionsIcon,
    component: Clients,
    layout: "/admin"
  },
  {
    path: "/create_config",
    name: "Create config",
    rtlName: "?????? ???????????? ????????????????",
    icon: ListAltIcon,
    component: Configs,
    layout: "/admin"
  },
  // {
  //   path: "/dash",
  //   name: "Create dash",
  //   rtlName: "?????? ???????????? ????????????????",
  //   icon: PanToolIcon,
  //   component: Dashboard,
  //   layout: "/admin"
  // },
  
];

export default dashboardRoutes;
