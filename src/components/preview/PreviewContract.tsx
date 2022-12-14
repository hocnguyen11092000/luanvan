import { Button, Space } from "antd";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DATE_FORMAT } from "../../enum";
import { setdataContract } from "../../redux/contractSlice";
import { formatMoment } from "../../utils/formatMoment";
import { formatPrice } from "../../utils/formatPrice";
import PageHeader from "../page-header/PageHeader";
import "./preview-contract.scss";
type Props = {};

const PreviewContract = (props: Props) => {
  const location = useLocation();
  const data: any = location.state;
  const navigate = useNavigate();
  const headerRef = useRef(null);
  console.log(data?.detail);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const dataContractRedux = useSelector(
    (state: any) => state.contract.dataContract
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setdataContract({ ...dataContractRedux, ...data } || null));
  }, [dispatch]);

  const handlePrintContract = () => {
    const header: any = headerRef.current;
    if (header) {
      header.style.display = "none";
    }
    window.print();

    setTimeout(() => {
      if (header) {
        header.style.display = "block";
      }
    }, 200);
  };

  return (
    <>
      {data?.detail && Object.keys(data?.detail).length > 0 ? (
        <>
          <div className="preview-contract-header" ref={headerRef}>
            <Space>
              <Button onClick={() => navigate(-1)}>Trở về</Button>
              <Button type="primary" onClick={handlePrintContract}>
                In hợp đồng
              </Button>
            </Space>
          </div>
          <div className="preview-contract">
            <div className="preview-contract-heading">
              <h2>Cộng hòa xã hội chủ nghĩa Việt nam</h2>
              <i>Độc lập - Tự do - Hạnh phúc</i>
              <b>
                <h2 className="bold">Hợp đồng mua bán lúa</h2>
              </b>
            </div>
            <div className="preview-contract-body">
              <i>
                <p>
                  {" "}
                  - Căn cứ vào bộ luật dân sự số 91/2015/QH13 ngày 24/11/2015 và
                  các văn bản phát luật liên quan;
                </p>
              </i>
              <i>
                <p>
                  {" "}
                  - Căn cứ Luật Thương mại số 36/2015/QH11 ngày 14/06/2005 và
                  các văn bản phát luật liên quan;
                </p>
              </i>
              <i>
                <p>- Căn cứ vào nhu cầu và khả năng của các bên;</p>
              </i>
              <br />
              <p>
                Hôm này ngày <b>{formatMoment(moment(new Date()))}</b> chúng tôi
                gồm có:
              </p>
              <div className="preview-contract-body">
                <div>
                  <p className="text-uper bold">
                    <span className="mr-12"> Biên bản ( bên A ): </span>
                    <b className="text-uper">
                      {" "}
                      {data?.detail?.name_thuonglai || ""}
                    </b>
                  </p>
                  <p>
                    <span className="bold mr-12">Địa chỉ: </span>{" "}
                    <span>{data?.detail?.address_thuonglai || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Số điện thoại: </span>{" "}
                    <span>{data?.detail?.phone_number_thuonglai || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Người đại diện: </span>{" "}
                    <span>{data?.detail?.daidien_thuonglai || ""}</span>
                  </p>
                </div>
                <br />
                <div>
                  <p className="text-uper bold">
                    <span className="mr-12"> Biên bản ( bên b ): </span>
                    <b className="text-uper">
                      {" "}
                      {data?.detail?.name_hoptacxa || ""}
                    </b>
                  </p>
                  <p>
                    <span className="bold mr-12">Địa chỉ: </span>{" "}
                    <span>{data?.detail?.address_hoptacxa || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Số điện thoại: </span>{" "}
                    <span>{data?.detail?.phone_number_hoptacxa || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Người đại diện: </span>{" "}
                    <span> {data?.detail?.daidien_hoptacxa || ""}</span>
                  </p>
                </div>
                <br />
                <p>
                  Trên cơ sở thỏa thuận 2 bên thống nhất ký kêt hợp đồng mua bán
                  lúa với các điều khoản sau đây:
                </p>
                <div className="preview-contract-body-rules">
                  <p className="bold text-uper">
                    Điều 1. Thông tin giống lúa, danh mục phân bón, mùa vụ, giá
                    thu mua
                  </p>
                  <p>
                    <b>Thông tin giống lúa </b>
                    <p className="ml-12">
                      - {data?.detail?.name_gionglua || ""}
                    </p>
                  </p>
                  <p>
                    <b>danh mục phân bón </b>
                    <p className="ml-12">
                      - {data?.detail?.name_danhmucquydinh || ""}
                    </p>
                  </p>
                  <p>
                    <b>Thông tin mùa vụ </b>
                    <p className="ml-12">
                      - {data?.detail?.name_lichmuavu || ""}
                    </p>
                  </p>
                  <p>
                    <b>Giá thu mua</b>
                    <p className="ml-12">
                      - {formatPrice(data?.detail?.price || 0)}
                    </p>
                  </p>
                </div>
                <div className="preview-contract-body-rules">
                  <br />
                  <br />
                  <p className="bold text-uper">
                    Các điều khoản kèm theo (nếu có)
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: data?.detail?.description_hopdongmuaban,
                    }}
                  ></p>
                </div>
              </div>
              <br />
              <div
                style={{ justifyContent: "space-evenly" }}
                className="preview-contract-footer align-center"
              >
                <div>
                  <p className="bold"> Đại diện bên thương lái</p>
                  <p>(ký tên và đóng dấu)</p>
                </div>
                <div>
                  <p className="bold"> Đại diện bên hợp tác xã</p>
                  <p>(ký tên và đóng dấu)</p>
                </div>
              </div>
            </div>
          </div>
          <br />
        </>
      ) : (
        <>
          <div className="preview-contract-header" ref={headerRef}>
            <Space>
              <Button onClick={() => navigate(-1)}>Trở về</Button>
              <Button type="primary" onClick={handlePrintContract}>
                In hợp đồng
              </Button>
            </Space>
          </div>
          <div className="preview-contract">
            <div className="preview-contract-heading">
              <h2>Cộng hòa xã hội chủ nghĩa Việt nam</h2>
              <i>Độc lập - Tự do - Hạnh phúc</i>
              <b>
                <h2 className="bold">Hợp đồng mua bán lúa</h2>
              </b>
            </div>
            <div className="preview-contract-body">
              <i>
                <p>
                  {" "}
                  - Căn cứ vào bộ luật dân sự số 91/2015/QH13 ngày 24/11/2015 và
                  các văn bản phát luật liên quan;
                </p>
              </i>
              <i>
                <p>
                  {" "}
                  - Căn cứ Luật Thương mại số 36/2015/QH11 ngày 14/06/2005 và
                  các văn bản phát luật liên quan;
                </p>
              </i>
              <i>
                <p>- Căn cứ vào nhu cầu và khả năng của các bên;</p>
              </i>
              <br />
              <p>
                Hôm này ngày <b>{formatMoment(moment(new Date()))}</b> chúng tôi
                gồm có:
              </p>
              <div className="preview-contract-body">
                <div>
                  <p className="text-uper bold">
                    <span className="mr-12"> Biên bản ( bên A ): </span>
                    <b className="text-uper">
                      {" "}
                      {data?.trader?.name_thuonglai || ""}
                    </b>
                  </p>
                  <p>
                    <span className="bold mr-12">Địa chỉ: </span>{" "}
                    <span>{data?.trader?.address || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Số điện thoại: </span>{" "}
                    <span>{data?.trader?.phone_number || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Người đại diện: </span>{" "}
                    <span>{data?.trader?.fullname || ""}</span>
                  </p>
                </div>
                <br />
                <div>
                  <p className="text-uper bold">
                    <span className="mr-12"> Biên bản ( bên b ): </span>
                    <b className="text-uper">
                      {" "}
                      {dataContractRedux?.name_hoptacxa || ""}
                    </b>
                  </p>
                  <p>
                    <span className="bold mr-12">Địa chỉ: </span>{" "}
                    <span>{dataContractRedux?.address_hoptacxa || ""}</span>
                  </p>
                  <p>
                    <span className="bold mr-12">Số điện thoại: </span>{" "}
                    <span>
                      {dataContractRedux?.phone_number_hoptacxa || ""}
                    </span>
                  </p>
                  <p>
                    <span className="bold mr-12">Người đại diện: </span>{" "}
                    <span> {dataContractRedux?.name_hoptacxa || ""}</span>
                  </p>
                </div>
                <br />
                <p>
                  Trên cơ sở thỏa thuận 2 bên thống nhất ký kêt hợp đồng mua bán
                  lúa với các điều khoản sau đây:
                </p>
                <div className="preview-contract-body-rules">
                  <p className="bold text-uper">
                    Điều 1. Thông tin giống lúa, danh mục phân bón, mùa vụ, giá
                    thu mua
                  </p>
                  <p>
                    <b>Thông tin giống lúa </b>
                    <p className="ml-12">
                      - {dataContractRedux?.name_gionglua || ""}
                    </p>
                  </p>
                  <p>
                    <b>danh mục phân bón </b>
                    <p className="ml-12">
                      - {dataContractRedux?.category?.name_danhmucquydinh || ""}
                    </p>
                  </p>
                  <p>
                    <b>Thông tin mùa vụ </b>
                    <p className="ml-12">
                      - {dataContractRedux?.name_lichmuavu || ""}
                    </p>
                  </p>
                  <p>
                    <b>Giá thu mua</b>
                    <p className="ml-12">
                      - {formatPrice(dataContractRedux?.price || 0)}
                    </p>
                  </p>
                </div>
                <div className="preview-contract-body-rules">
                  <br />
                  <br />
                  <p className="bold text-uper">
                    Các điều khoản kèm theo (nếu có)
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: dataContractRedux?.desc,
                    }}
                  ></p>
                </div>
              </div>
              <br />
              <div
                style={{ justifyContent: "space-evenly" }}
                className="preview-contract-footer align-center"
              >
                <div>
                  <p className="bold"> Đại diện bên thương lái</p>
                  <p>(ký tên và đóng dấu)</p>
                </div>
                <div>
                  <p className="bold"> Đại diện bên hợp tác xã</p>
                  <p>(ký tên và đóng dấu)</p>
                </div>
              </div>
            </div>
          </div>
          <br />
        </>
      )}
    </>
  );
};

export default PreviewContract;
