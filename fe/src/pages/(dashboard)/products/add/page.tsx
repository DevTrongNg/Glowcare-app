import { Button, Checkbox, FormProps, Input, InputNumber, message, Upload } from "antd";
import { AiFillBackward } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";

type FieldType = {
  name: string;
  price: number;
  description: string;
  featured: boolean;
  countInStock: number;
  discount: number;
  category: string[];
  image: string;
  gallery: string[];
  tags: string[];
  attributes: string; // nhập JSON hoặc "key:value,key:value"
};

const ProductAddPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Lấy danh mục từ API
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => instance.get(`/categories`),
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: FieldType) => {
      try {
        return await instance.post(`/products`, formData);
      } catch (error) {
        throw new Error((error as any).message);
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm sản phẩm thành công!",
      });
      form.resetFields();
    },
    onError: (error: any) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // Chuyển tags thành mảng
    const payload = {
      ...values,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      gallery: values.gallery ? values.gallery.split(",").map((g) => g.trim()) : [],
      attributes: values.attributes ? JSON.parse(values.attributes) : [],
    };
    console.log("Submit:", payload);
    mutate(payload);
  };

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Thêm sản phẩm</h1>
        <Link to="/admin/products">
          <Button type="primary">
            <AiFillBackward /> Quay lại
          </Button>
        </Link>
      </div>

      <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-[auto,300px] gap-8">
          <div>
            {/* Tên */}
            <Form.Item<FieldType>
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Tên sản phẩm bắt buộc nhập!" }]}
            >
              <Input />
            </Form.Item>

            {/* Giá */}
            <Form.Item<FieldType>
              label="Giá sản phẩm"
              name="price"
              rules={[
                { required: true, message: "Giá sản phẩm bắt buộc nhập!" },
                { type: "number", min: 0, message: "Giá sản phẩm phải lớn hơn 0" },
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>

            {/* Giảm giá */}
            <Form.Item<FieldType>
              label="Giá khuyến mãi"
              name="discount"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value < getFieldValue("price")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Giá khuyến mãi phải nhỏ hơn giá sản phẩm!")
                    );
                  },
                }),
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item<FieldType> label="Mô tả sản phẩm" name="description">
              <TextArea rows={4} />
            </Form.Item>

            {/* Ảnh chính */}
            <Form.Item<FieldType>
              label="Ảnh chính (URL)"
              name="image"
              rules={[{ required: true, message: "Ảnh chính bắt buộc nhập!" }]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            {/* Ảnh con */}
            <Form.Item<FieldType>
              label="Ảnh con (URL, cách nhau bởi dấu phẩy)"
              name="gallery"
            >
              <TextArea rows={2} placeholder="url1, url2, url3" />
            </Form.Item>

            {/* Tags */}
            <Form.Item<FieldType>
              label="Tags (ngăn cách bằng dấu phẩy)"
              name="tags"
            >
              <Input placeholder="skincare, makeup, lipstick" />
            </Form.Item>

            {/* Attributes */}
            <Form.Item<FieldType>
              label="Thuộc tính (JSON)"
              name="attributes"
            >
              <TextArea
                rows={2}
                placeholder='Ví dụ: [{"key":"dung tích","value":"100ml"},{"key":"màu","value":"Đỏ"}]'
              />
            </Form.Item>

            {/* Featured */}
            <Form.Item<FieldType> name="featured" valuePropName="checked">
              <Checkbox>Sản phẩm nổi bật</Checkbox>
            </Form.Item>

            {/* Tồn kho */}
            <Form.Item<FieldType>
              label="Sản phẩm trong kho"
              name="countInStock"
              rules={[{ type: "number", min: 0, message: "Số lượng sản phẩm >= 0" }]}
            >
              <InputNumber className="w-full" defaultValue={0} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </div>

          {/* Danh mục */}
          <div>
            <Form.Item label="Danh mục sản phẩm" name="category">
              <Checkbox.Group>
                {categories?.data.map((category: any) => (
                  <Checkbox key={category._id} value={category._id}>
                    {category.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProductAddPage;
