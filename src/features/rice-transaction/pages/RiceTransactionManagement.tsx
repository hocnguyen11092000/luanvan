import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import queryString from "query-string";
import materialsApi from "../../../api/materials";
import userRiceTransactionApi from "../../../api/userRiceTransaction";
import { formatPrice } from "../../../utils/formatPrice";
import { getResponseMessage } from "../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type Props = {
  baseUrl?: string;
  role?: string;
};

const RiceTransactionManagement = ({ baseUrl, role }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [deleteId, setDeleteId] = useState<any>();

  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  // useEffect(() => {
  // //   (() => {
  // //     navigate(
  // //       `/${baseUrl || "shop"}/shop-management?${queryString.stringify(filter)}`
  // //     );
  // //   })();
  // // }, [filter]);
  // console.log(role);

  const fetchListRiceTransaction = (filter: any) =>
    role == "chunhiem"
      ? userRiceTransactionApi.getAllChairman(filter)
      : userRiceTransactionApi.getAll(filter);

  const userRiceTransaction: any = useQuery(
    ["user/rice/transaction", filter],
    () => fetchListRiceTransaction(filter)
  );

  const handleConfirm = (value: any, id: any, type: any) => {
    if (value !== null) {
      //approve here
    } else {
      mutation_confirm_rice_transaction.mutate(id, {
        onSuccess: (res) => {
          getResponseMessage(res);
          userRiceTransaction.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    }
  };

  const mutation_confirm_rice_transaction = useMutation((id) =>
    userRiceTransactionApi.confirm(id)
  );

  const handleApprove = (value: any, id: any) => {
    if (value != 2) {
      mutation_update_approve.mutate(
        { id: id, hoptacxa_xacnhan: value },
        {
          onSuccess: (res) => {
            getResponseMessage(res);
            setShowReason(false);
            userRiceTransaction.refetch();
          },
          onError: (err) => {
            getErrorMessage(err);
          },
        }
      );
    } else {
      setShowReason(true);
      setDeleteId(id);
    }
  };

  const handleSave = () => {
    mutation_update_approve.mutate(
      { id: deleteId, hoptacxa_xacnhan: 2, reason: reasonValue },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
          userRiceTransaction.refetch();
          setShowReason(false);
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  const mutation_update_approve = useMutation((data: any) =>
    userRiceTransactionApi.approve(data, data?.id || "")
  );

  const tableColumns: any = [
    {
      title: "ID",
      width: "5%",
      dataIndex: "id_giaodichmuaban_lua",
    },
    {
      title: "T??n l?? h??ng",
      width: "15%",
      dataIndex: "name_lohang",
    },
    {
      title: "M??a v???",
      width: "10%",
      dataIndex: "name_lichmuavu",
    },
    {
      title: "X?? vi??n",
      dataIndex: "name_xavien",
      width: "8%",
    },
    {
      title: "T??n th????ng l??i",
      dataIndex: "name_thuonglai",
      width: "8%",
    },
    {
      title: "S??? l?????ng",
      dataIndex: "soluong",
    },
    {
      title: "Gi??",
      dataIndex: "price",
      render: (_: any, record: any) => {
        return <span>{formatPrice(record?.price || 0)}</span>;
      },
    },
    {
      title: "Tr???ng th??i",
      width: "9%",
      dataIndex: "status",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.status == 0 ? (
              <span className="not-success">ch??a ho??n th??nh</span>
            ) : (
              <span className="success">ho??n th??nh</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Htx x??c nh???n",
      width: "8%",
      dataIndex: "hoptacxa_xacnhan",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.hoptacxa_xacnhan == 0 ? (
              <span className="not-confirm">ch??a x??c nh???n</span>
            ) : record?.hoptacxa_xacnhan == 2 ? (
              <span className="refuse">???? h???y</span>
            ) : (
              <span className="confirm">x??c nh???n</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Th????ng l??i x??c nh???n",
      width: "7%",
      dataIndex: "thuonglai_xacnhan",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.thuonglai_xacnhan == 0 ? (
              <span className="not-confirm">ch??a x??c nh???n</span>
            ) : (
              <span className="confirm">x??c nh???n</span>
            )}
          </span>
        );
      },
    },
    {
      title: "X?? vi??n x??c nh???n",
      dataIndex: "xavien_xacnhan",
      width: "7%",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.xavien_xacnhan == 0 ? (
              <span className="not-confirm">ch??a x??c nh???n</span>
            ) : (
              <span className="confirm">x??c nh???n</span>
            )}
          </span>
        );
      },
    },
    {
      fixed: "right",
      title: "H??nh ?????ng",
      width: "12%",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() =>
              navigate(
                `/${baseUrl || "htx"}/rice-transaction-management/detail/${
                  record?.id_giaodichmuaban_lua || ""
                }`
              )
            }
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <EditOutlined />
          </span>
          {role == "chunhiem" && (
            <Select
              onChange={(value: number | string) =>
                handleApprove(value, record?.id_giaodichmuaban_lua || "")
              }
              size="small"
              value={record?.hoptacxa_xacnhan + "" || ""}
              placeholder="Tr???ng th??i"
              style={{ width: 150 }}
              options={[
                {
                  value: "0",
                  label: "Ch??a x??c nh???n",
                },
                {
                  value: "1",
                  label: "X??c nh???n",
                },
                {
                  value: "2",
                  label: "H???y",
                },
              ]}
            />
          )}

          <Button
            loading={mutation_confirm_rice_transaction.isLoading}
            onClick={() =>
              handleConfirm(null, record?.id_giaodichmuaban_lua, "trader")
            }
            type="primary"
          >
            {role != "chunhiem" &&
              (role == "xavien"
                ? record?.xavien_xacnhan
                  ? "H???y x??c nh???n"
                  : "X??c nh???n"
                : record?.thuonglai_xacnhan
                ? "H???y x??c nh???n"
                : "X??c nh???n")}
          </Button>
        </>
      ),
    },
  ];

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  return (
    <div className="shop-management">
      <Modal
        title="L?? do t??? ch???i"
        open={showReason}
        onCancel={() => setShowReason(false)}
      >
        <Input
          placeholder="L?? do t??? ch???i"
          onChange={(e) => setReasonValue(e.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSave();
            }
          }}
        />
        <br />
        <Button
          loading={mutation_update_approve.isLoading}
          type="primary"
          onClick={handleSave}
        >
          L??u
        </Button>
      </Modal>
      {role == "nhacungcap" && (
        <Button>
          <Link to="/shop/shop-management/create-shop">T???o h???p ?????ng</Link>
        </Button>
      )}
      <h3 style={{ margin: "16px 0" }}>Danh s??ch giao d???ch mua b??n l??a</h3>
      <Table
        scroll={{ x: 2100 }}
        loading={
          userRiceTransaction.isLoading || mutation_update_approve.isLoading
        }
        columns={tableColumns}
        dataSource={userRiceTransaction?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {userRiceTransaction?.data?.meta?.total > 0 && (
          <Pagination
          size="small"
            // defaultCurrent={filter?.page as number}
            current={Number(filter.page)}
            total={userRiceTransaction?.data?.meta?.total}
            pageSize={filter?.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default RiceTransactionManagement;
