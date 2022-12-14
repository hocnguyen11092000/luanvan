import { Skeleton } from "antd";
import React from "react";
import ListNews from "../../features/home/components/news/list-news/ListNews";
import "./search-result.scss";
type Props = {
  bottom?: string;
  data: any;
  show: boolean;
  loading?: boolean;
  searchWords?: string;
};

const SearchResult = ({
  bottom,
  data = [],
  show = false,
  loading = false,
  searchWords,
}: Props) => {
  return (
    <>
      {show && (
        <div style={bottom ? { bottom: bottom } : {}} className="search-result">
          <div className="search-result__content">
            {loading && (
              <>
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <Skeleton.Image
                    active={true}
                    style={{ width: "150px" }}
                    className="radius-6"
                  />
                  <div>
                    <Skeleton.Button
                      active={true}
                      style={{
                        width: "250px",
                        height: "20px",
                        marginBottom: "12px",
                      }}
                      className="radius-6"
                    />

                    <Skeleton.Input
                      active={true}
                      style={{ width: "400px", height: "62px" }}
                      className="radius-6"
                    />
                  </div>
                </div>
                <br />
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <Skeleton.Image
                    active={true}
                    style={{ width: "150px" }}
                    className="radius-6"
                  />
                  <div>
                    <Skeleton.Button
                      active={true}
                      style={{
                        width: "250px",
                        height: "20px",
                        marginBottom: "12px",
                      }}
                      className="radius-6"
                    />

                    <Skeleton.Input
                      active={true}
                      style={{ width: "400px", height: "62px" }}
                      className="radius-6"
                    />
                  </div>
                </div>
              </>
            )}
            {!loading && data && (
              <ListNews
                search
                headerText={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    K???t qu??? t??m ki???m:{" "}
                    <span className="main-color search-count">
                      T??m th???y <b>({data?.length})</b> k???t qu???
                    </span>
                  </div>
                }
                header={true}
                post={data}
                searchWords={searchWords}
              ></ListNews>
            )}

            {!loading && data && data?.length == 0 && (
              <div style={{ color: "#333", textAlign: "center" }}>
                Kh??ng t??m th???y k???t qu???
              </div>
            )}
            {!loading && !data && (
              <div style={{ color: "#333", textAlign: "center" }}>
                Vui l??ng nh???p t??? kh??a t??m ki???m
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResult;
