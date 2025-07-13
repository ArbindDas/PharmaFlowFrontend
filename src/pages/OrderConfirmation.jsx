import { Button, Card, Typography, Space, Result } from 'antd';
import { SmileOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId || '#UNKNOWN';
  const total = state?.total || 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
      <Result
        icon={<SmileOutlined />}
        title="Thank You for Your Order!"
        subTitle={`Order number: ${orderId}`}
        extra={[
          <Button 
            type="primary" 
            key="shop" 
            onClick={() => navigate('/medicines')}
            icon={<ShoppingOutlined />}
          >
            Continue Shopping
          </Button>,
          <Button 
            key="orders"
            onClick={() => navigate('/orders')}
          >
            View Your Orders
          </Button>
        ]}
      />

      <Card style={{ marginTop: '24px', textAlign: 'left' }}>
        <Title level={4}>Order Summary</Title>
        <Space direction="vertical">
          <Text strong>Order Number: {orderId}</Text>
          <Text>Total Amount: ${total.toFixed(2)}</Text>
          <Text>Payment Method: Credit Card</Text>
          <Text>Estimated Delivery: 3-5 business days</Text>
        </Space>
      </Card>
    </div>
  );
}

export default OrderConfirmation;