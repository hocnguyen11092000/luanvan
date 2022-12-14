import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./story-of-season.scss";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
} from "antd";
import { DataSourceItemType } from "antd/lib/auto-complete";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import storyApi from "../../../api/storyApi";
import FormComponent from "../../../components/form-component/FormComponent";
import { formatMoment } from "../../../utils/formatMoment";
import { getResponseMessage } from "../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import landApi from "../../../api/land";
import { ColumnsType } from "antd/lib/table";
import { convertToMoment } from "../../../utils/convertToMoment";
import AutoComplete from "../../../components/auto-complete/AutoComplete";

type Props = {};

const StoryOfSeason = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [searchForm] = Form.useForm();
  const [showModalReason, setShowModalReason] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [detailStory, setDetailStory] = useState<any>();
  const [type, setType] = useState<any>("create");
  const [categoryOfActivity, setCategoryOfActivity] = useState<any>(
    detailStory?.vattusudung || []
  );
  const [detailStoryId, setDetailStoryId] = useState<
    number | string | undefined
  >();
  const [loadingDetailStory, setLoadingDetailStory] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<any>();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    setCategoryOfActivity(detailStory?.vattusudung || []);
  }, [detailStoryId]);

  const fetchListLand = () => {
    return landApi.getAll({});
  };

  const land = useQuery(["activity/land"], fetchListLand);
  const actdivityForm = [
    {
      name: "name_hoatdong",
      label: "T??n ho???t ?????ng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="T??n ho???t ?????ng"></Input>,
    },
    {
      name: "date_start",
      label: "Ng??y b???t ?????u",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker placeholder="Ng??y b???t ?????u" style={{ width: "100%" }} />
      ),
    },
    {
      name: "id_thuadat",
      label: "Th???a ?????t",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Select placeholder="Th???a ?????t">
          {land &&
            land?.data?.data.map((item: any) => {
              return (
                <Select.Option key={item.id_thuadat} value={item.id_thuadat}>
                  {item.address}
                </Select.Option>
              );
            })}
        </Select>
      ),
    },
    {
      name: "date_end",
      label: "Ng??y k???t th??c",
      rules: [
        {
          required: true,
        },
        ({ getFieldValue }: any): any => ({
          validator(_: any, value: any) {
            if (!value || getFieldValue("date_start") <= value) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("Ng??y k???t th??c ph???i l???n h??n ng??y b???t ?????u!")
            );
          },
        }),
      ],
      formChildren: (
        <DatePicker placeholder="Ng??y k???t th??c" style={{ width: "100%" }} />
      ),
    },
    {
      name: "description",
      label: "M?? t???",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="M?? t???"></Input.TextArea>,
    },
  ];

  useEffect(() => {
    (() => {
      navigate(
        `/htx/manage-story/detail/${id}?${queryString.stringify(filter)}`
      );
    })();
  }, [filter, id]);

  const handleUpdateStory = async (id: string | number | undefined) => {
    setLoadingDetailStory(true);
    setType("edit");

    try {
      setDetailStoryId(id);
      setIsModalOpen(true);
      const res = await storyApi.getDetail(id);
      setCategoryOfActivity(res?.data?.vattusudung || []);

      let data = res?.data;
      if (res && res.data) {
        const date = [
          {
            key: "date_start",
            value: data.date_start,
          },
          {
            key: "date_end",
            value: data.date_end,
          },
        ];

        if (convertToMoment(date)) {
          data = {
            ...data,
            ...convertToMoment(date),
          };
        }
      }
      setDetailStory(data || {});
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoadingDetailStory(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id_nhatkydongruong",
    },
    {
      title: "ID th???a ?????t",
      dataIndex: "id_thuadat",
    },
    {
      title: "T??n ho???t ?????ng",
      dataIndex: "name_hoatdong",
    },
    {
      title: "Ng??y b???t ?????u",
      dataIndex: "date_start",
    },
    {
      width: "20%",
      title: "Ng??y k???t th??c",
      dataIndex: "date_end",
    },
    {
      title: "Htx x??c nh???n",
      dataIndex: "hoptacxa_xacnhan",
      render: (_, record) => (
        <span>
          {record?.hoptacxa_xacnhan == 0
            ? "Ch??a x??c nh???n"
            : record?.hoptacxa_xacnhan == 1 || record?.hoptacxa_xacnhan === null
            ? "???? x??c nh???n"
            : "???? b??? h???y"}
        </span>
      ),
    },
    {
      title: (
        <div>
          <span>Thao t??c</span>
          {/* <Checkbox
            style={{ marginLeft: "16px" }}
            onChange={(e) => handleCheckAllActivity(e)}
          ></Checkbox> */}
        </div>
      ),
      dataIndex: "status",
      render: (_: any, record: any) => {
        return (
          <div>
            <Popconfirm
              placement="topRight"
              title={"B???n c?? ch???c ch???n ?????i tr???ng th??i"}
              onConfirm={() =>
                handleChangeStatus(record?.id_nhatkydongruong || "", null)
              }
              okText="Yes"
              cancelText="No"
            >
              <Checkbox
                style={{ marginLeft: "16px" }}
                disabled={
                  record?.type !== "inside" &&
                  !Boolean(record?.hoptacxa_xacnhan)
                }
                defaultChecked={record?.status || false}
                checked={record?.status || false}
                // onChange={(e) =>
                //   handleChangeStatus(record?.id_nhatkydongruong || "", e)
                // }
              ></Checkbox>
            </Popconfirm>

            <span
              className=""
              onClick={() => {
                handleUpdateStory(record?.id_nhatkydongruong);
              }}
              style={{
                display: "inline-block",
                marginLeft: "16px",
                cursor: "pointer",
              }}
            >
              <EditOutlined />
            </span>
            <span>
              {record.type !== "inside" && (
                <span
                  style={{ cursor: "pointer", marginLeft: "16px" }}
                  className=""
                >
                  <Popconfirm
                    placement="top"
                    title="X??a ho???t ?????ng?"
                    onConfirm={() =>
                      handleConfirmDeleteActivityOfSeason(
                        record?.id_nhatkydongruong || ""
                      )
                    }
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </span>
              )}
            </span>
          </div>
        );
      },
    },
  ];

  const handleCheckAllActivity = (e: any) => {
    console.log(e);
  };

  const handleConfirmDeleteActivityOfSeason = async (id: string | number) => {
    try {
      const res = await storyApi.delete(id);
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const categoryForm = [
    {
      autoComplete: (
        <AutoComplete
          getName={true}
          returnName
          keyword=""
          type="vattusudung"
          Key="id_giaodichmuaban_vattu"
          Value="name_category_vattu"
          name="id_giaodichmuaban_vattu"
          lable="V???t t??"
        ></AutoComplete>
      ),
    },
    {
      name: "soluong",
      label: "S??? l?????ng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <InputNumber
          placeholder="S??? l?????ng"
          style={{ width: "100%" }}
        ></InputNumber>
      ),
    },
    {
      name: "timeuse",
      label: "Th???i gian s??? d???ng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker placeholder="Th???i gian s??? d???ng" style={{ width: "100%" }} />
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
    setType("create");

    setIsCreate(true);
    setDetailStoryId(undefined);
    setDetailStory({});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const fetchActivityOfSeasonList = (filter: any) => {
    return storyApi.getAll(id as string, filter);
  };

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["storyOfSeason/list", filter],
    () => fetchActivityOfSeasonList(filter),
    { cacheTime: 0 }
  ) as any;

  const mutation_add_activity = useMutation((data: any) =>
    storyApi.createActivity(data)
  );

  const mutation_update_activity = useMutation((data: any) =>
    storyApi.update(data, detailStoryId || "")
  );

  const handleChangeStatus = async (id: any, e: any) => {
    setChangeStatusLoading(true);

    try {
      const res = await storyApi.updateStatus(id);
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setChangeStatusLoading(false);
    }
  };

  const handleFormSubmit = (values: any) => {
    values.id_lichmuavu = id || "";
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.vattusudung =
      categoryOfActivity.map((item: any) => {
        return {
          ...item,
          id_giaodichmuaban_vattu:
            item?.id_vattusudung ||
            JSON.parse(item?.id_giaodichmuaban_vattu)?.key ||
            "",
        };
      }) || [];

    if (detailStoryId) {
      mutation_update_activity.mutate(values, {
        onSuccess: (res) => {
          getResponseMessage(res);
          setIsModalOpen(false);
          refetch();
        },
        onError: (err) => getErrorMessage(err),
      });
    } else {
      mutation_add_activity.mutate(values, {
        onSuccess: (res) => {
          getResponseMessage(res);
          setIsModalOpen(false);
          refetch();
        },
        onError: (err) => getErrorMessage(err),
      });
    }
  };

  const handleSearchActivity = (value: { search: string }) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleAddField = () => {
    setIsModalOpenCategory(true);
  };

  const handleCancelCategory = () => {
    setIsModalOpenCategory(false);
  };

  const handleFormSubmitCategory = (values: any) => {
    values.timeuse = values.timeuse.format("YYYY-MM-DD");
    setCategoryOfActivity((pre: any) => {
      const item = categoryOfActivity.find(
        (item: any) =>
          item?.id_giaodichmuaban_vattu == values.id_giaodichmuaban_vattu
      );
      if (item) {
        item.soluong += values.soluong;
        return [...pre];
      } else {
        return [...pre, values];
      }
    });

    setIsModalOpenCategory(false);
  };

  const handleDeleteCategory = (data: any) => {
    setCategoryOfActivity((pre: any) => {
      return pre?.filter((c: any) => c?.id_giaodichmuaban_vattu !== data);
    });
  };

  return (
    <div className="season-of-story">
      <div>
        <Button onClick={showModal}>Th??m ho???t ?????ng</Button>
      </div>
      <br />
      <h3>Danh s??ch ho???t ?????ng</h3>
      <div style={{ textAlign: "right" }}>
        <Form
          form={searchForm}
          layout="vertical"
          name="search-activity"
          id="search-activity"
          onFinish={handleSearchActivity}
        >
          <Form.Item name="search">
            <Space>
              <Input
                defaultValue={filter.search}
                placeholder="T??m ki???m ho???t ?????ng"
              ></Input>
              <Button form="search-activity" type="primary" htmlType="submit">
                T??m ki???m
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Table
          pagination={false}
          loading={isLoading || changeStatusLoading}
          columns={columns}
          dataSource={data?.data}
          rowClassName={(record) =>
            record.type !== "inside" && !Boolean(record?.hoptacxa_xacnhan)
              ? "disabled-row"
              : record?.hoptacxa_xacnhan == "2"
              ? "error-col"
              : ""
          }
        />
      </div>
      <div className="pagiantion">
        {data?.meta?.total > 0 && (
          <Pagination
            size="small"
            // defaultCurrent={filter.page as number}
            current={Number(filter.page)}
            total={data?.meta?.total}
            pageSize={filter.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>

      <Modal
        centered
        onCancel={handleCancel}
        title={
          detailStory && Object.keys(detailStory).length > 0
            ? "Ch???nh s???a ho???t ?????ng"
            : "T???o ho???t ?????ng"
        }
        open={isModalOpen}
        width="70%"
        bodyStyle={{
          overflowY: "auto",
          maxHeight: "500px",
          position: "relative",
        }}
      >
        <Spin spinning={loadingDetailStory || (isLoading && !isCreate)}>
          <FormComponent
            type={type}
            isCreate={isCreate}
            initialValues={detailStory}
            updateId={detailStoryId}
            loading={
              mutation_add_activity.isLoading ||
              mutation_update_activity.isLoading ||
              false
            }
            onSubmit={handleFormSubmit}
            name="activityOfSeason"
            buttonSubmit="Th??m ho???t ?????ng"
            addField={true}
            onAddField={handleAddField}
            data={actdivityForm}
            categoryOfActivity={categoryOfActivity}
            onDeleteCategory={handleDeleteCategory}
          ></FormComponent>
        </Spin>
      </Modal>
      <Modal
        onCancel={handleCancelCategory}
        title={
          detailStory && Object.keys(detailStory).length > 0
            ? "Ch???nh s???a v???t t??"
            : "Th??m v???t t??"
        }
        open={isModalOpenCategory}
        width="50%"
        centered
      >
        <Spin spinning={false}>
          <FormComponent
            loading={false}
            onSubmit={handleFormSubmitCategory}
            name="categoryOfStory"
            buttonSubmit="Th??m v???t t??"
            data={categoryForm}
          ></FormComponent>
        </Spin>
      </Modal>
    </div>
  );
};

export default StoryOfSeason;
