import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Divider, 
  Form, 
  Input, 
  Select, 
  Space, 
  message, 
  Radio,
  Row,
  Col,
  Alert
} from 'antd';
import { 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  HomeOutlined, 
  EnvironmentOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function CheckoutPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you would typically send the order to your backend
      console.log('Order submitted:', {
        ...values,
        items: cart,
        total: totalPrice,
        userId: user?.id,
        paymentMethod
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          orderId: `#${Math.floor(Math.random() * 1000000)}`,
          total: totalPrice 
        } 
      });
    } catch (error) {
      message.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
        <Card>
          <Title level={4}>Your cart is empty</Title>
          <Text>There are no items to checkout</Text>
          <div style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/medicines')}
            >
              Browse Medicines
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        Back
      </Button>

      <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CreditCardOutlined />
        Checkout
      </Title>

      <Row gutter={24}>
        <Col xs={24} md={14}>
          <Card title="Delivery Information" style={{ marginBottom: '24px' }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || ''
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="your@email.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input size="large" placeholder="+1 234 567 890" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <TextArea 
                  rows={3} 
                  size="large" 
                  placeholder="Street address, apartment, floor, etc." 
                />
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please enter your city' }]}
                  >
                    <Input size="large" placeholder="City" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="zipCode"
                    label="ZIP Code"
                    rules={[{ required: true, message: 'Please enter your ZIP code' }]}
                  >
                    <Input size="large" placeholder="ZIP Code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please select your country' }]}
              >
                <Select size="large" placeholder="Select country">
                  <Option value="usa">United States</Option>
                  <Option value="uk">United Kingdom</Option>
                  <Option value="canada">Canada</Option>
                  <Option value="australia">Australia</Option>
                  <Option value="germany">Germany</Option>
                  {/* Add more countries as needed */}
                </Select>
              </Form.Item>

              <Divider />

              <Title level={4} style={{ marginBottom: '16px' }}>
                Payment Method
              </Title>

              <Form.Item name="paymentMethod">
                <Radio.Group 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  value={paymentMethod}
                >
                  <Space direction="vertical">
                    <Radio value="credit_card">
                      <Space align="center">
                        <CreditCardOutlined />
                        <Text>Credit/Debit Card</Text>
                      </Space>
                    </Radio>
                    <Radio value="paypal">
                      <Space align="center">
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                          alt="PayPal" 
                          style={{ width: '37px', height: '23px' }} 
                        />
                        <Text>PayPal</Text>
                      </Space>
                    </Radio>
                    <Radio value="cod">
                      <Space align="center">
                        <HomeOutlined />
                        <Text>Cash on Delivery</Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === 'credit_card' && (
                <>
                  <Form.Item
                    name="cardNumber"
                    label="Card Number"
                    rules={[{ required: true, message: 'Please enter your card number' }]}
                  >
                    <Input size="large" placeholder="1234 5678 9012 3456" />
                  </Form.Item>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        name="expiryDate"
                        label="Expiry Date"
                        rules={[{ required: true, message: 'Please enter expiry date' }]}
                      >
                        <Input size="large" placeholder="MM/YY" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[{ required: true, message: 'Please enter CVV' }]}
                      >
                        <Input size="large" placeholder="123" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <Form.Item
                name="notes"
                label="Order Notes (Optional)"
              >
                <TextArea 
                  rows={3} 
                  size="large" 
                  placeholder="Special instructions, delivery preferences, etc." 
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Order Summary" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {cart.map(item => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                    />
                    <div>
                      <Text strong>{item.name}</Text>
                      <div style={{ color: '#666', fontSize: '14px' }}>
                        {item.quantity} x ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
                </div>
              ))}

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Subtotal</Text>
                <Text>${totalPrice.toFixed(2)}</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Shipping</Text>
                <Text>$0.00</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tax</Text>
                <Text>$0.00</Text>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: '16px' }}>Total</Text>
                <Text strong style={{ fontSize: '16px' }}>${totalPrice.toFixed(2)}</Text>
              </div>

              <Alert
                message="Free delivery"
                description="All orders qualify for free shipping"
                type="info"
                showIcon
                style={{ margin: '16px 0' }}
              />

              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={() => form.submit()}
                icon={<CreditCardOutlined />}
              >
                Place Order
              </Button>
            </Space>
          </Card>

          <Card title="Delivery Address">
            <Space direction="vertical">
              <Text strong>Standard Delivery</Text>
              <Text>Items will be delivered within 3-5 business days</Text>
              <div style={{ marginTop: '12px' }}>
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                <Text>We deliver to all major cities and towns</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CheckoutPage;