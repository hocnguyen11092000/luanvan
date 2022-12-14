import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import contractApi from "../../../../api/contract";
import shopContractApi from "../../../../api/shopContract";
import traderApi from "../../../../api/trader";
import AutoComplete from "../../../../components/auto-complete/AutoComplete";
import { PATH } from "../../../../enum";
import { searchUser } from "../../../../redux/contractSlice";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { validateMessage } from "../../../../utils/validateMessage";
import UploadImage from "../../../../components/upload-image/UploadImage";
import supplierContractApi from "../../../../api/supplierContract";
import supplierCategoryContractApi from "../../../../api/supplierCategoryContract";

type Props = {};

const CreateContractSupplier = (props: Props) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(undefined);
  const [ckData, setCkData] = useState();
  const [seachValue, setSearchValue] = useState<string>("");
  const [file, setFile] = useState();
  const [dataContract, setDataContract] = useState<any>({});
  const [searchUserError, setSearchuserError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchUserStore = useSelector(
    (state: any) => state.contract.searchUser
  );

  useEffect(() => {
    setUser(searchUserStore);
    setSearchValue(searchUserStore?.xavien_phone_number || "");
  }, []);

  const detailShop = useSelector((state: any) => state.user.user);

  const mutation_create_contract = useMutation((data: any) => {
    return supplierCategoryContractApi.create(data);
  });

  const handleSubmitForm = (values: any) => {
    values.id_nhacungcapvattu = detailShop?.id_user || "";
    values.id_xavien = user?.id_user || "";
    values.id_lichmuavu = user?.id_lichmuavu || "";
    values.description_giaodich = ckData || "";
    values.img_lohang = file || null;

    const formData: any = new FormData();
    formData.append("id_xavien", values.id_xavien);
    formData.append("id_nhacungcapvattu", values.id_nhacungcapvattu);
    formData.append("id_lichmuavu", values.id_lichmuavu);
    formData.append("id_category_vattu", values.id_category_vattu);
    formData.append("description_giaodich", values.description_giaodich);
    formData.append("img_lohang", values.img_lohang);
    formData.append("soluong", values.soluong);
    formData.append("price", values.price);

    mutation_create_contract.mutate(formData, {
      onSuccess: (data: any) => {
        getResponseMessage(data);
        // navigate("/trader/contract-management");
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const fetchSeason = (id: string | number) => {
    if (id) {
      return contractApi.getListSeason(id);
    } else {
      return null;
    }
  };

  const handleSeachUser = async () => {
    mutation.mutate(
      { phone_number: seachValue, type: "giaodichmuabanvattu" },
      {
        onSuccess: (data) => {
          setUser(data.data);
          dispatch(searchUser(data.data));

          setDataContract((pre: any) => {
            return {
              ...pre,
              user: data.data || {},
            };
          });
        },
        onError: (err: any) => {
          // console.log(err);
          const error: any = err?.response?.data.errorList[0];
          if (error) {
            setSearchuserError(error);
          }
          setUser(null);
        },
      }
    );
  };

  const mutation = useMutation((value: any) => {
    return shopContractApi.searchUser(value);
  });

  // if (user && Object.keys(user).length > 0) {
  //   form.setFieldsValue({ ...user });
  // }

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  return (
    <Spin spinning={false}>
      <div className="create-contract">
        <h3 className="create-contract-heading">T???o h???p ?????ng mua b??n v???t t??</h3>
        <br />
        <div className="create-contract-form">
          <Form
            form={form}
            layout="vertical"
            name="create-supplier-contract"
            validateMessages={validateMessage()}
            onFinish={handleSubmitForm}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}
              style={{ alignItems: "center" }}
            >
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item name="title_hopdongmuaban" label="">
                  {/* <Input
                    placeholder="T??n h??p ?????ng"
                    onChange={(e) =>
                      setDataContract((pre: any) => {
                        return {
                          ...pre,
                          title: e.target.value || "",
                        };
                      })
                    }
                  /> */}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <div
                  className="add-user-to-htx__search"
                  style={{ position: "relative", top: "0" }}
                >
                  <Input
                    defaultValue={searchUserStore?.xavien_phone_number}
                    value={searchUserStore?.xavien_phone_number}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="T??m ki???m x?? vi??n"
                    size="middle"
                    style={{ borderRadius: "5px" }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSeachUser();
                      }
                    }}
                  />
                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    style={{ borderRadius: "5px" }}
                    onClick={handleSeachUser}
                  >
                    T??m ki???m
                  </Button>
                </div>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Collapse defaultActiveKey={["1"]} bordered={false}>
                  <Collapse.Panel header="B??n A" key="1">
                    {detailShop && (
                      <>
                        <p className="align-center">
                          <span className="trader-label"> T??n Shop:</span>
                          <span className="trader-detail">
                            {detailShop?.fullname || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> S??? ??i???n tho???i: </span>
                          <span className="trader-detail">
                            {detailShop?.phone_number || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> ?????i ch???: </span>
                          <span className="trader-detail">
                            {detailShop?.address || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Email: </span>
                          <span className="trader-detail">
                            {detailShop.email || ""}
                          </span>
                        </p>
                      </>
                    )}
                  </Collapse.Panel>
                </Collapse>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                {user === undefined && "T??m ki???m x?? vi??n b???n mu???n t???o h???p ?????ng"}
                {!user && searchUserError && "Kh??ng t??m th???y x?? vi??n"}
                {user && (
                  <Collapse defaultActiveKey={["B"]} bordered={false}>
                    <Collapse.Panel header="B??n B" key="B">
                      {user && (
                        <>
                          <p className="align-center">
                            <span className="trader-label"> T??n x?? vi??n:</span>
                            <span className="trader-detail">
                              {user?.fullname || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              S??? ??i???n tho???i:{" "}
                            </span>
                            <span className="trader-detail">
                              {user?.xavien_phone_number || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label"> ?????i ch???: </span>
                            <span className="trader-detail">
                              {user?.address || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              Ng?????i ?????i di???n:{" "}
                            </span>
                            <span className="trader-detail">
                              {user?.name_hoptacxa || ""}
                            </span>
                          </p>
                        </>
                      )}
                    </Collapse.Panel>
                  </Collapse>
                )}
              </Col>
            </Row>
            <br />
            {user && (
              <>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <AutoComplete
                      queryParams={{
                        danhmucquydinh: user?.id_danhmucquydinh || "",
                      }}
                      onSelect={(value: any) =>
                        setDataContract((pre: any) => {
                          return { ...pre, rice: value || "" };
                        })
                      }
                      returnName
                      keyword="name_category_vattu"
                      type="category-vattu"
                      Key="id_category_vattu"
                      Value="name_category_vattu"
                      name="id_category_vattu"
                      lable="V???t t??"
                    ></AutoComplete>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="soluong"
                      label="S??? l?????ng"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="S??? l?????ng"
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="price"
                      label="Gi??"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Gi??"
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <h4>M?? t??? h???p ?????ng:</h4>
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          "selectAll",
                          "undo",
                          "redo",
                          "bold",
                          "italic",
                          "blockQuote",
                          "ckfinder",
                          "imageTextAlternative",
                          "imageUpload",
                          "heading",
                          "imageStyle:full",
                          "imageStyle:side",
                          "indent",
                          "outdent",
                          "link",
                          "numberedList",
                          "bulletedList",
                          "mediaEmbed",
                          "insertTable",
                          "tableColumn",
                          "tableRow",
                          "mergeTableCells",
                          "fontBackgroundColor",
                          "fontColor",
                        ],
                        image: {
                          // Configure the available styles.
                          styles: ["alignLeft", "alignCenter", "alignRight"],
                          sizes: ["50%", "75%", "100%"],

                          // Configure the available image resize options.
                          resizeOptions: [
                            {
                              name: "imageResize:original",
                              label: "Original",
                              value: null,
                            },
                            {
                              name: "imageResize:50",
                              label: "50%",
                              value: "50",
                            },
                            {
                              name: "imageResize:75",
                              label: "75%",
                              value: "75",
                            },
                          ],

                          // You need to configure the image toolbar, too, so it shows the new style
                          // buttons as well as the resize buttons.
                          toolbar: [
                            "imageStyle:alignLeft",
                            "imageStyle:alignCenter",
                            "imageStyle:alignRight",
                            "|",
                            "imageResize",
                            "|",
                            "imageTextAlternative",
                          ],
                        },
                      }}
                      data=""
                      onChange={(event: any, editor: any) => {
                        const data = editor.getData();

                        setCkData(data);
                      }}
                    />
                    <div style={{ color: "#ff4d4f", margin: "8px 0 0 0" }}>
                      {ckData === "" && "Tr?????ng n??y kh??ng ???????c b??? tr???ng"}
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <UploadImage onChange={handleChangeImage}></UploadImage>
                  </Col>
                </Row>
                <br />
                <Row>
                  <div className="common-form-submit">
                    <Space>
                      <Button
                        disabled={ckData === ""}
                        form={"create-supplier-contract"}
                        type="primary"
                        htmlType="submit"
                        loading={mutation_create_contract.isLoading}
                      >
                        T???o h???p ?????ng
                      </Button>
                    </Space>
                  </div>
                </Row>
              </>
            )}
          </Form>
        </div>
        <br />
      </div>
    </Spin>
  );
};

export default CreateContractSupplier;
