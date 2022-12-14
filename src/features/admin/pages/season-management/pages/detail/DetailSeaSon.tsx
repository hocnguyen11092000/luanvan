import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./detail-season.scss";
import queryString from "query-string";
import { useSelector } from "react-redux";
import calendarApi from "../../../../../../api/calendar";
import { useMutation, useQuery } from "@tanstack/react-query";
import activityApi from "../../../../../../api/activity";
import { formatMoment } from "../../../../../../utils/formatMoment";
import { validateMessage } from "../../../../../../utils/validateMessage";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AutoComplete from "../../../../../../components/auto-complete/AutoComplete";
import FormComponent from "../../../../../../components/form-component/FormComponent";
import { convertToMoment } from "../../../../../../utils/convertToMoment";
import { getErrorMessage } from "../../../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../../../utils/getResponseMessage";
import PageHeader from "../../../../../../components/page-header/PageHeader";
import ActionOfList from "../../../../../../components/action-of-list/ActionOfList";

type Props = {};

const DetailSeaSon = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [loadingDetailAct, setLoadingDetailAct] = useState(false);
  const [activityDetail, setActivityDetail] = useState();
  const [activityId, setActivityId] = useState<number>();
  const [disableBtnUpdateSeason, setDisableBtnUpdateSeason] = useState(false);
  const [columns, setColumns] = useState<any>([
    {
      title: "ID",
      dataIndex: "id_hoatdongmuavu",
    },
    {
      title: "T??n ho???t ?????ng",
      dataIndex: "name_hoatdong",
    },
    {
      title: "M??t t??? ho???t ?????ng",
      dataIndex: "description_hoatdong",
      rowSpan: 4,
    },
    {
      title: "Ng??y b???t ?????u",
      dataIndex: "date_start",
    },
    {
      title: "Ng??y k???t th??c",
      dataIndex: "date_end",
    },
    {
      title: "H??nh ?????ng",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() => handleEditActivity(record?.id_hoatdongmuavu)}
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <EditOutlined />
          </span>
          <span className="" style={{ cursor: "pointer" }}>
            <Popconfirm
              placement="top"
              title="X??a ho???t ?????ng?"
              onConfirm={() => handleConfirmDeleteActivity(record)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ]);

  const defaultFilter = {
    page: 1,
    limit: 5,
    search: "",
  };

  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    (() => {
      navigate(
        `/htx/manage-season/detail/${id}?${queryString.stringify(filter)}`
      );
    })();
  }, [filter]);

  const htx = useSelector((state: any) => state.htx.role);

  const seasonForm = [
    {
      name: "name_lichmuavu",
      label: "T??n m??a v???",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="T??n m??a v???"></Input>,
    },
    {
      autoComplete: (
        <AutoComplete
          returnName
          keyword="name_gionglua"
          type="gionglua"
          Key="id_gionglua"
          Value="name_gionglua"
          name="id_gionglua"
          lable="Gi???ng l??a"
        ></AutoComplete>
      ),
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
      name: "date_end",
      label: "Ng??y k???t th??c",
      rules: [
        {
          required: true,
        },
        ({ getFieldValue }: any): any => ({
          validator(_: any, value: any) {
            if (!value || getFieldValue("date_start") < value) {
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
  ];

  const handleConfirmDeleteActivity = async (record: any) => {
    try {
      await activityApi.delete(record?.id_hoatdongmuavu || "");
      message.success("X??a th??nh c??ng");
      activity.refetch();
    } catch (error) {
      message.error("X??a th???t b???i");
      console.log(error);
    }
  };

  const fetchSeasonDetail = () => {
    return calendarApi.getDetail(id);
  };

  let seaSonDetail: any = useQuery(["season/detail"], fetchSeasonDetail, {
    cacheTime: 0,
  });

  let seaSonDetailData = seaSonDetail.data?.data || {};

  if (seaSonDetail && seaSonDetail.data) {
    const date = [
      {
        key: "date_start",
        value: seaSonDetailData.date_start,
      },
      {
        key: "date_end",
        value: seaSonDetailData.date_end,
      },
    ];

    if (convertToMoment(date)) {
      seaSonDetailData = {
        ...seaSonDetailData,
        ...convertToMoment(date),
      };
    }
  }

  const fetchActivitySeason = (filter: any) => {
    return activityApi.getAll(id as string, {
      ...filter,
    });
  };

  const activity: any = useQuery(["season/activity", filter], () =>
    fetchActivitySeason(filter)
  );

  const showModal = () => {
    form.resetFields();
    setActivityDetail(undefined);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (values: any) => {
    values.id_hoptacxa = htx.id_hoptacxa || null;
    values.id_hoatdongmuavu = activityId || null;
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.id_lichmuavu = id || null;

    if (activityDetail && Object.keys(activityDetail).length > 0) {
      console.log(activityDetail, values.id_hoatdongmuavu);

      // values.id_lichmuavu = id || null; ??

      mutation_update_activity.mutate(values, {
        onSuccess: (val) => {
          getResponseMessage(val);
          setIsModalOpen(false);
          activity.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    } else {
      mutation_create_activity.mutate(values, {
        onSuccess: (val) => {
          getResponseMessage(val);
          setIsModalOpen(false);
          activity.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    }
  };

  const mutation_create_activity = useMutation((data: any) =>
    activityApi.create(data)
  );

  const mutation_update_activity = useMutation((data: any) =>
    activityApi.update(data, data?.id_hoatdongmuavu || "")
  );

  const handlePagination = (page: number) => {
    setCurrentPage(page);

    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSearchActivity = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const mutation_calendar = useMutation((data: any) =>
    calendarApi.updateCalendar(data, data?.id_lichmuavu || "")
  );

  const handleFormSubmit = (values: any) => {
    console.log(id);
    console.log("run");

    values.id_hoptacxa = htx.role.id_hoptacxa;
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.id_lichmuavu = id;

    mutation_calendar.mutate(values, {
      onError: (err) => getErrorMessage(err),
      onSuccess: () => {
        message.success("Thay ?????i l???ch th??nh c??ng");

        setIsModalOpen(false);
        seaSonDetail.refetch();
      },
    });
  };

  const handleDisableUpdateSeason = (value: boolean) => {
    setDisableBtnUpdateSeason(value);
  };

  let formComponentProps: any = {
    loading: mutation_calendar.isLoading,
    onSubmit: handleFormSubmit,
    name: "season",
    buttonSubmit: "Th??m l???ch m??a v???",
    data: seasonForm,
    hideBtnSubmit: true,
    onDisable: handleDisableUpdateSeason,
  };

  if (Object.keys(seaSonDetailData).length > 0) {
    formComponentProps = {
      ...formComponentProps,
      initialValues: seaSonDetailData,
    };
  }

  const handleEditActivity = async (id: number) => {
    setLoadingDetailAct(true);
    setIsModalOpen(true);
    setActivityId(id);

    try {
      const res = await activityApi.getDetail(id);
      if (Object.keys(res.data).length > 0) {
        const date = [
          {
            key: "date_start",
            value: res.data?.date_start,
          },
          {
            key: "date_end",
            value: res.data?.date_end,
          },
        ];

        if (convertToMoment(date)) {
          setActivityDetail({ ...res.data, ...convertToMoment(date) });
          form.setFieldsValue({ ...res.data, ...convertToMoment(date) });
        }
      }
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoadingDetailAct(false);
    }
  };

  const handleResetField = () => {
    setFilter(defaultFilter);
    setCurrentPage(1);

    activity.refetch();
    form2.resetFields();
  };

  const handleFilterCol = (data: any) => {
    setColumns(data);
  };

  const handleAppyActivity = () => {
    mutation_apply_activity.mutate(
      {
        id_lichmuavu: id || "",
      },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  const mutation_apply_activity = useMutation((id: any) =>
    calendarApi.apply(id)
  );

  const headerBreadcrumb = [
    {
      name: "H???p t??c x??",
      path: "/htx",
    },
    {
      name: `chi ti???t m??a v???`,
      path: "/season-detail",
    },
    {
      name: `${id}`,
      path: "/season-detail",
    },
  ];

  return (
    <div className="detail-season">
      <PageHeader
        headerBreadcrumb={headerBreadcrumb}
        allowSave={seaSonDetail.data?.data?.status == "finish" ? false : true}
        loading={mutation_calendar.isLoading}
        form="season"
        disabled={disableBtnUpdateSeason}
      ></PageHeader>
      <Row gutter={30}>
        <Col lg={12} md={12} sm={20} xs={20}>
          <Skeleton loading={seaSonDetail.isLoading} active>
            <p></p>
          </Skeleton>
        </Col>

        <Col lg={10} md={10} sm={20} xs={20}>
          <Skeleton loading={seaSonDetail.isLoading} active>
            <p></p>
          </Skeleton>
        </Col>
      </Row>

      {seaSonDetail.data && seaSonDetail.data.data && (
        <Row>
          <Col span={24}>
            {/* <Descriptions title="Chi ti???t l???ch m??a v???">
              <Descriptions.Item label="T??n m??a v???">
                {seaSonDetail.data?.data.name_lichmuavu}
              </Descriptions.Item>
              <Descriptions.Item label="T??n gi???ng l??a">
                {seaSonDetail.data?.data.name_lichmuavu}
              </Descriptions.Item>
              <Descriptions.Item label="Tr???ng th??i">
                {seaSonDetail.data?.data.status}
              </Descriptions.Item>
              <Descriptions.Item label="Ng??y b???t ?????u">
                {seaSonDetail.data?.data.date_start}
              </Descriptions.Item>
              <Descriptions.Item label="Ng??y k???t th??c">
                {seaSonDetail.data?.data.date_end}
              </Descriptions.Item>
            </Descriptions> */}
            <FormComponent {...formComponentProps}></FormComponent>
          </Col>
        </Row>
      )}

      {seaSonDetail.isLoading ? (
        <div className="activity-action">
          <Space
            style={{
              width: "100%",
              padding: "16px 16px 20px 0",
              justifyContent: "space-between",
            }}
          >
            <Skeleton.Button
              active={true}
              shape="default"
              style={{ width: "200px" }}
            />
          </Space>
        </div>
      ) : (
        <div className="activity-action">
          <Space
            align="center"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="btn btn-add-activity">
                <Button onClick={showModal} type="primary">
                  Th??m ho???t ?????ng
                </Button>
              </div>
              <div className="apply-activity">
                <Button
                  loading={mutation_apply_activity.isLoading}
                  type="primary"
                  onClick={handleAppyActivity}
                >
                  ??p l???ch m??a v???
                </Button>
              </div>
            </div>
            <div className="seach-activity">
              <Form
                form={form2}
                layout="vertical"
                name="search-activity"
                id="search-activity"
                onFinish={handleSearchActivity}
              >
                <Form.Item name="search">
                  <Space>
                    <Input
                      ref={inputRef}
                      defaultValue={filter.search}
                      placeholder="T??m ki???m ho???t ?????ng"
                    ></Input>
                    <Button
                      form="search-activity"
                      type="primary"
                      htmlType="submit"
                    >
                      T??m ki???m
                    </Button>

                    <Popover
                      placement="topLeft"
                      title={"Thao t??c m??? r???ng"}
                      content={
                        <ActionOfList
                          onSetFilterCol={handleFilterCol}
                          columns={columns}
                          onRefetch={() => activity.refetch()}
                          onReset={handleResetField}
                        ></ActionOfList>
                      }
                      trigger="click"
                    >
                      <Button type="primary">
                        <PlusOutlined />
                      </Button>
                    </Popover>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Space>
        </div>
      )}

      <Table
        loading={activity.isLoading || activity.isFetching}
        columns={columns}
        dataSource={activity?.data?.data}
        pagination={false}
      />
      <div className="pagiantion">
        {activity?.data?.meta?.total > 0 && (
          <Pagination
            size="small"
            // defaultCurrent={filter.page as number}
            current={Number(filter.page)}
            total={activity?.data?.meta?.total}
            pageSize={filter.limit as number}
            onChange={handlePagination}
            // current={currentPage}
          />
        )}
      </div>
      <br />
      <br />
      <Modal
        title="T???o ho???t ?????ng m??a v???"
        onOk={handleCancel}
        open={isModalOpen}
        onCancel={handleCancel}
        bodyStyle={{ height: "auto" }}
        width="70%"
      >
        <Spin spinning={loadingDetailAct}>
          <Form
            validateMessages={validateMessage()}
            form={form}
            layout="vertical"
            name="add activity season"
            onFinish={onSubmit}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name_hoatdong"
                  label="T??n ho???t ?????ng"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="T??n ho???t ?????ng" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="description_hoatdong"
                  label="M?? t??? ho???t ????ng"
                >
                  <Input.TextArea
                    placeholder="M?? t??? ho???t ?????ng"
                    rows={4}
                  ></Input.TextArea>
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button
                    form="add activity season"
                    type="primary"
                    htmlType="submit"
                    className="btn"
                    loading={
                      mutation_create_activity.isLoading ||
                      mutation_update_activity.isLoading
                    }
                  >
                    {activityDetail ? "S???a ho???t ?????ng" : "  Th??m ho???t ?????ng"}
                  </Button>
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="date_start"
                  label="Ng??y b???t ?????u"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Ng??y b???t ?????u"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="date_end"
                  label="Ng??y k???t th??c"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("date_start") <= value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Ng??y k???t th??c ph???i l???n h??n ng??y b???t ?????u!")
                        );
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Ng??y k???t th??c"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default DetailSeaSon;
