import { Menu } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isChairman, setRole } from "../../../../redux/htxSlice";

type Props = {
  account?: any[];
};

const RenderChangeApp = ({ account = [] }: Props) => {
  const htx = useSelector((state: any) => state.htx.role);
  const isChairmanSlt = useSelector((state: any) => state.htx.isChairman);

  let items: any = [];
  const navigate = useNavigate();

  const handleNavigate = (value: string | null) => {
    navigate("/htx/dashboard", { state: { role: value } });
  };

  if (
    (htx && htx?.role === "chunhiem") ||
    isChairmanSlt ||
    localStorage.getItem("account") === "chunhiem" ||
    localStorage.getItem("chairman")
  ) {
    items = [
      {
        label: <span>Quản lý Hợp tác xã</span>,
        key: "chunhiem",
      },
      {
        label: <span>Quản quản lý xã viên</span>,
        key: "xavien",
      },
      {
        label: <span onClick={() => navigate("/")}>Trang chủ</span>,
        key: "home",
      },
    ];
  } else {
    items = [
      {
        label: <span>Quản quản lý xã viên</span>,
        key: "xavien",
      },
      {
        label: <span onClick={() => navigate("/")}>Trang chủ</span>,
        key: "home",
      },
    ];
  }

  const onMenuClick = (e: any) => {
    if (e.key !== "home") {
      localStorage.setItem("current_account", e.key);
      handleNavigate(e.key || "");
    }
  };

  return (
    <div className="change-app">
      <Menu
        onClick={onMenuClick}
        defaultSelectedKeys={[htx?.role || "xavien"]}
        items={items}
      />
    </div>
  );
};

export default RenderChangeApp;
