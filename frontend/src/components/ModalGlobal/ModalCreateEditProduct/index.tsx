import { useEffect, useMemo, useRef, useState } from "react";
import { FieldArray, Formik, FormikProps } from "formik";
import { Button, Col, Row, Upload } from "antd";
import ModalGlobal from "..";
import ApiService, { ICreateServiceBody, IServiceRes } from "@/api/ApiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  SelectFormikGlobal,
  TextAreaFormikGlobal,
} from "@/components/FormGlobal";
import EditorCustom from '../../EditorCustom'
import ApiProduct from "@/api/ApiProduct";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ApiCategory from "@/api/ApiCategory";

interface IModalCreateEdit {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selected?: any;
}

export default function ModalCreateEditProduct({
  isOpenModal,
  handleCloseModal,
  selected,
}: IModalCreateEdit) {

  console.log(selected);


  const innerRef = useRef<FormikProps<any>>(null);
  const queryClient = useQueryClient();

  const [description, setDescription] = useState(selected?.description ?? '')

  const { data: categories } = useQuery(
    ["get_categories"],
    () => ApiCategory.list({ page: 1, limit: 9999 }),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (selected) setDescription(selected?.description)
    else setDescription('')
  }, [selected])

  const initialValues: any = useMemo(() => {
    return {
      variants: selected?.variants ?? [],
      name: selected?.name ?? '',
      price: selected?.price ?? 0,
      category_id: selected?.category?.id ?? undefined,
    };
  }, [selected]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createMutation = useMutation(ApiProduct.create);
  const updateMutation = useMutation(ApiProduct.update);

  const handleSubmit = async (values: any) => {
    console.log(values);

    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('description', description);
    formData.append('price', values.price)
    formData.append('category_id', values.category_id);

    // Mảng chứa tất cả ảnh để gửi lên API
    const images: File[] = [];

    // Xử lý biến thể sản phẩm
    values.variants.forEach((variant: any, index: number) => {
      formData.append(`variants[${index}][type]`, variant.type);
      formData.append(`variants[${index}][stock]`, variant.stock);
      // formData.append(`variants[${index}][price]`, variant.price);


      if (variant.image && variant.image instanceof File) {
        images.push(variant.image);
      }
      if (variant.image && typeof variant.image === 'string') {
        formData.append(`variants[${index}][image]`, variant.image);
      }

      if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
    });

    // // Nếu có ảnh sản phẩm chính
    // if (values.image && values.image instanceof File) {
    //   images.unshift(values.image); // Đưa ảnh sản phẩm chính lên đầu
    // }
    // Thêm tất cả ảnh vào formData
    images.forEach((file) => {
      formData.append('images', file);
    });
    console.log(images);


    if (selected) {
      updateMutation.mutate(
        { id: +selected.id, data: formData },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_products"]);
            onCancel();
          },
        }
      );
      return;
    }
    createMutation.mutate(formData, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_products"]);
        onCancel();
      },
    });
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, setFieldValue, values }) => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={selected ? "Sửa thông tin sản phẩm" : "Tạo sản phẩm"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={createMutation.isLoading || updateMutation.isLoading}
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[32, 0]}>
                <Col span={8}>
                  <div className="text-xl mb-2 font-medium">Thêm sản phẩm</div>
                  <FormItemGlobal name="name" label="Tên sản phẩm" required>
                    <InputFormikGlobal name="name" placeholder="Tên sản phẩm" />
                  </FormItemGlobal>
                  <FormItemGlobal name="price" label="Giá" required>
                    <InputNumberFormikGlobal name="price" placeholder="Giá" />
                  </FormItemGlobal>
                  <FormItemGlobal name="category_id" label="Thuộc danh mục" required>
                    <SelectFormikGlobal name="category_id" options={categories?.results.map(c => ({
                      label: c.name,
                      value: c.id
                    }))} />
                  </FormItemGlobal>
                  <EditorCustom value={description} setValue={setDescription} name="Mô tả sản phẩm" disable={false} />
                </Col>
                <Col span={16}>
                  <div className="text-xl mb-2 font-medium">Thêm sản phẩm con</div>

                  <FieldArray name="variants">
                    {({ push, remove }) => (
                      <>
                        {values.variants.map((variant: any, index: number) => (
                          <Row key={index} gutter={[8, 8]} align="middle">
                            <Col span={6}>
                              <FormItemGlobal name={`variants.${index}.type`} label="Loại" required>
                                <InputFormikGlobal name={`variants.${index}.type`} placeholder="Loại" />
                              </FormItemGlobal>
                            </Col>

                            <Col span={6}>
                              <FormItemGlobal name={`variants.${index}.stock`} label="Tồn kho" required>
                                <InputFormikGlobal name={`variants.${index}.stock`} type="number" placeholder="Số lượng" min={0} />
                              </FormItemGlobal>
                            </Col>

                            {/* <Col span={4}>
                              <FormItemGlobal name={`variants.${index}.price`} label="Giá" required>
                                <InputFormikGlobal name={`variants.${index}.price`} type="number" placeholder="Giá" min={0} />
                              </FormItemGlobal>
                            </Col> */}

                            <Col span={8}>
                              <FormItemGlobal name={`variants.${index}.image`} label="Ảnh sản phẩm">
                                <Upload
                                  name={`variants.${index}.image`}
                                  listType="picture-card"
                                  className="avatar-uploader"
                                  showUploadList={false}
                                  beforeUpload={(file) => {
                                    setFieldValue(`variants.${index}.image`, file);
                                    return false; // Không upload ngay, chỉ lưu vào Formik
                                  }}
                                >
                                  {variant.image ? (
                                    <img
                                      src={typeof variant.image === 'string' ? variant.image : URL.createObjectURL(variant.image)}
                                      alt="avatar"
                                      style={{ width: '100%' }}
                                    />
                                  ) : (
                                    <div>
                                      <PlusOutlined />
                                      <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                  )}
                                </Upload>
                              </FormItemGlobal>
                            </Col>

                            <Col span={2}>
                              <Button danger onClick={() => remove(index)} icon={<MinusCircleOutlined />} />
                            </Col>
                          </Row>
                        ))}

                        <Button type="dashed" onClick={() => push({ type: "", stock: 0, price: 0, image: null })} icon={<PlusOutlined />}>
                          Thêm sản phẩm con
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </Col>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
