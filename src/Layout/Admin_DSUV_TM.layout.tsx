import { Input, Radio, Select } from "antd";
import { useState } from "react";
import btnStyles from "@/Css/button.module.css";

import TextArea from "antd/es/input/TextArea";
import {
  timesOfDay,
  job,
  dayOfTheWeek,
} from "@/constants/EditProfile.constant";
import { quan_huyen, tinh_thanh } from "@/utils/vi_tri";
import { axiosSauDN } from "@/utils/axios.config";
import { notifySuccess, notifyWarning } from "@/utils/generalFunction";
import { ToastContainer } from "react-toastify";
function Admin_DSUV_TM() {
  const keys = [
    "userName",
    "phone",
    "email",
    "password",
    "city",
    "district",
    "address",
    "uv_congviec",
  ];
  const [codeCity, setCodeCity] = useState(0);
  const [duLieuMoi, setDuLieuMoi] = useState<any>({});
  const [jobValues, setJobValues] = useState([]);
  const [adressValues, setAdressValues] = useState([]);
  const [arrDay, setArrDay] = useState<any>([]);
  const handleInput = (e: any) => {
    setDuLieuMoi({ ...duLieuMoi, [e.target.name]: e.target.value });
  };
  const handleChangeJob = (selected: any) => {
    // Kiểm tra số lượng mục đã chọn và giới hạn nó

    if (selected.length <= 3) {
      setJobValues(selected);
    }
  };
  const handleChangeAddress = (selected: any) => {
    // Kiểm tra số lượng mục đã chọn và giới hạn nó
    if (selected.length <= 3) {
      setAdressValues(selected);
      console.log("dulieumoi", adressValues);
    }
  };
  const handleChonBuoiCTDL = (day: number, buoi: number) => {
    const findIndex = arrDay.findIndex((d: number) => d == day * 10 + buoi);
    if (findIndex != -1) {
      arrDay.splice(findIndex, 1);
      setArrDay([...arrDay]);
    } else {
      setArrDay([...arrDay, Number(`${day}${buoi}`)]);
    }
  };
  const handleGuiData = () => {
    let flagCheck = true;
    for (const key of keys) {
      if (!duLieuMoi[key]) {
        notifyWarning(`Vui lòng nhập ${key}`);
        flagCheck = false;
        break;
      }
    }
    if (flagCheck) {
      if (adressValues.length == 0 || jobValues.length == 0) {
        notifyWarning("Vui lòng nhập đầy đủ thông tin!");
      } else if (arrDay.length == 0) {
        notifyWarning("Vui lòng chọn ca có thể đi làm!");
      } else {
        axiosSauDN
          .post("/admin/createUngVien", {
            ...duLieuMoi,
            day: arrDay,
            uv_diadiem: adressValues,
            uv_nganhnghe: jobValues,
          })
          .then((res) => notifySuccess("Thêm mới thành công!"))
          .catch((err) => console.log("DSUV_TM", err));
      }
    }
  };
  return (
    <div className="w-1/2">
      <div className="text-center">
        Những ô dấu sao (<span className="text-red-500">*</span>) là bắt buộc
        phải nhập
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Tên ứng viên:{" "}
          <Input
            onChange={(e) => handleInput(e)}
            name="userName"
            value={duLieuMoi.userName}
            style={{ width: 500, marginLeft: "20px" }}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Số điện thoại:{" "}
          <Input
            onChange={(e) => handleInput(e)}
            name="phone"
            value={duLieuMoi.phone}
            style={{ width: 500, marginLeft: "20px" }}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Email ứng viên:{" "}
          <Input
            onChange={(e) => handleInput(e)}
            name="email"
            value={duLieuMoi.email}
            style={{ width: 500, marginLeft: "20px" }}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Mật khẩu ứng viên:{" "}
          <Input
            onChange={(e) => handleInput(e)}
            name="password"
            value={duLieuMoi.password}
            style={{ width: 500, marginLeft: "20px" }}
          />
        </div>
        <div className="flex items-center mt-3">
          Tỉnh thành:{" "}
          <Select
            style={{ width: 500, marginLeft: "20px" }}
            showSearch
            onChange={(e) => {
              setDuLieuMoi({ ...duLieuMoi, city: e });
              setCodeCity(e);
            }}
            placeholder="Chọn tỉnh thành"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={tinh_thanh.map((city) => ({
              label: city.cit_name,
              value: city.cit_id,
            }))}
          ></Select>
        </div>
        <div className="flex items-center mt-3">
          Quận huyện:{" "}
          <Select
            style={{ width: 500, marginLeft: "20px" }}
            showSearch
            onChange={(e) => setDuLieuMoi({ ...duLieuMoi, district: e })}
            placeholder="Chọn quận huyện"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={quan_huyen
              .filter((e) => e.cit_parent == codeCity)
              .map((city) => ({
                label: city.cit_name,
                value: city.cit_id,
              }))}
          ></Select>
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Địa chỉ ứng viên:{" "}
          <TextArea
            onChange={(e) => handleInput(e)}
            name="address"
            value={duLieuMoi.address}
            style={{ width: 500, marginLeft: "20px" }}
            rows={3}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Công việc mong muốn:{" "}
          <Input
            onChange={(e) => handleInput(e)}
            name="uv_congviec"
            value={duLieuMoi.uv_congviec}
            style={{ width: 500, marginLeft: "20px" }}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Địa điểm:{" "}
          <Select
            mode="multiple"
            allowClear
            style={{ width: 500, marginLeft: "20px" }}
            placeholder="Chọn tối đa 3 doanh mục"
            options={[
              ...tinh_thanh.map((city) => ({
                value: city.cit_id,
                label: city.cit_name,
              })),
            ]}
            onChange={handleChangeAddress}
            value={adressValues}
          />
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Ngành nghề:{" "}
          <Select
            mode="multiple"
            allowClear
            style={{ width: 500, marginLeft: "20px" }}
            placeholder="Chọn tối đa 3 doanh mục"
            options={job}
            onChange={handleChangeJob}
            value={jobValues}
          />
        </div>
        <div className="flex items-center mt-3">
          Ảnh ứng viên:{" "}
          <Input
            type="file"
            style={{ width: 300, marginLeft: "20px", marginRight: "29px" }}
          />
          <span className="text-red-500">Kích thước chuẩn (190x190)</span>
        </div>
        <div className="flex items-center mt-3 mr-80">
          <div className="mr-3">
            <span className="text-red-500 mx-2">*</span> Buổi có thể đi làm:{" "}
          </div>
          <div>
            {dayOfTheWeek.map((d, i) => (
              <div key={i}>
                <p>{d.label}</p>
                <div className="flex my-0.5">
                  {timesOfDay.map((buoi, index) => (
                    <div key={index} className="mr-3">
                      <input
                        checked={arrDay.some(
                          (day: number) =>
                            day == Number(`${d.value}${buoi.value}`)
                        )}
                        onClick={() => handleChonBuoiCTDL(d.value, buoi.value)}
                        className="mr-2"
                        type="checkbox"
                        name={d.label}
                        id={`${d.value * 10 + buoi.value}`}
                      />
                      <label htmlFor={`${d.value * 10 + buoi.value}`}>
                        {buoi.label}
                      </label>{" "}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center mt-3">
          <span className="text-red-500 mx-2">*</span> Sau khi lưu dữ liệu:{" "}
          <Radio.Group style={{ width: 500, marginLeft: "20px" }}>
            <Radio value={"new"}>Thêm mới</Radio>
            <Radio value={"back"}>Quay về danh sách</Radio>
            <Radio value={"edit"}>Sửa bản ghi</Radio>
          </Radio.Group>
        </div>
        <div className="flex items-center my-3">
          <div
            onClick={handleGuiData}
            className={btnStyles.btn_update + " mr-3"}
          >
            {" "}
            Cập nhập
          </div>
          <div className={btnStyles.btn_redo}> Làm lại</div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default Admin_DSUV_TM;
