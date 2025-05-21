import * as Yup from "yup";

const PromotionValidation = (type: "create" | "edit") =>
  Yup.object().shape({
    name: Yup.string().trim().required("Tên khuyến mại không được để trống"),
    discount: Yup.string().required("Discount không được để trống"),
    file:
      type === "create"
        ? Yup.string().required("Ảnh minh họa không được để trống")
        : Yup.string(),
  });

export { PromotionValidation };
