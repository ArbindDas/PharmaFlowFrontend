import { Button, Badge, Tag, Tooltip, Modal, Descriptions, Image, Rate, Divider ,message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import { 
  Pill, 
  CalendarDays, 
  CircleDollarSign, 
  Package, 
  FlaskConical, 
  Eye, 
  AlertTriangle,
  Star,
  Zap,
  Leaf,
  Shield,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Share2,
  ClipboardList,
  Scale,
  Heart
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { App } from 'antd';


function PublicMedicineCard({ medicine }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { isDarkMode } = useTheme();

  const { addToCart } = useCart();
  const { useApp } = App;  // Destructure useApp from App
   const { message } = useApp();
 

  const isLowStock = medicine.stock <= 5 && medicine.stock > 0;
  const isExpiringSoon = new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Theme-aware colors
  const themeColors = {
    cardBg: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    cardBorder: isDarkMode ? 'rgba(71, 85, 105, 0.6)' : 'rgba(226, 232, 240, 0.6)',
    titleColor: isDarkMode ? '#f8fafc' : '#1e293b',
    descriptionColor: isDarkMode ? '#94a3b8' : '#64748b',
    contentBg: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
    metaBorder: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)',
    quantityBg: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
    quantityColor: isDarkMode ? '#e2e8f0' : '#1e293b',
    dividerColor: isDarkMode ? '#334155' : '#e2e8f0',
    modalBg: isDarkMode ? '#1e293b' : '#ffffff',
    modalText: isDarkMode ? '#f8fafc' : '#1e293b',
    modalBorder: isDarkMode ? '#334155' : '#e2e8f0',
    descriptionText: isDarkMode ? '#cbd5e1' : '#4b5563'
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };



const handleAddToCart = (e) => {
  
  
 
  try {
     e.stopPropagation();
    addToCart(medicine, quantity);
    message.success(`${quantity} ${medicine.name} added to cart!`);
    setQuantity(1);
    console.log("cart added successfully");
    
  } catch (error) {
    message.error('Failed to add item to cart');
    console.error('Add to cart error:', error);
  }
};
  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log(isLiked ? 'Removed from wishlist:' : 'Added to wishlist:', medicine.name);
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.min(prev + 1, medicine.stock));
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const cardStyle = {
    position: 'relative',
    background: themeColors.cardBg,
    borderRadius: '20px',
    border: `1px solid ${themeColors.cardBorder}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? `0 25px 50px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.15'}), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)` 
      : `0 4px 20px rgba(0, 0, 0, ${isDarkMode ? '0.2' : '0.08'}), 0 0 0 1px rgba(255, 255, 255, 0.05)`,
    backdropFilter: 'blur(20px)',
    width: '320px',
    height: '480px',
    margin: '16px',
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '200px',
    background: isHovered 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle = {
    width: '140px',
    height: '140px',
    objectFit: 'contain',
    borderRadius: '16px',
    background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    padding: '16px',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
    transition: 'all 0.4s ease',
    transform: isHovered ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)',
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'})`,
  };

  const contentStyle = {
    padding: '24px',
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: themeColors.titleColor,
    marginBottom: '8px',
    lineHeight: '1.3',
    letterSpacing: '-0.025em',
  };

  const descriptionStyle = {
    color: themeColors.descriptionColor,
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontWeight: '400',
  };

  const priceContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };

  const priceStyle = {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.025em',
  };

  const stockBadgeStyle = {
    background: medicine.stock > 0 
      ? (isLowStock ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)')
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    boxShadow: `0 2px 8px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.15'})`,
  };

  const metaInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '12px',
    background: themeColors.contentBg,
    borderRadius: '12px',
    border: `1px solid ${themeColors.metaBorder}`,
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: themeColors.descriptionColor,
    fontWeight: '500',
  };

  const buttonStyle = {
    width: '100%',
    height: '48px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    background: medicine.stock > 0 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: 'white',
    boxShadow: medicine.stock > 0 
      ? `0 4px 20px rgba(59, 130, 246, ${isDarkMode ? '0.6' : '0.4'}), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
      : `0 4px 20px rgba(107, 114, 128, ${isDarkMode ? '0.5' : '0.3'})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.025em',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
  };

  return (
    <>
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={showModal}
      >
        <div style={overlayStyle} />
        
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isLowStock && (
            <Badge 
              count={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} />
                  <span>Low Stock</span>
                </div>
              } 
              style={{ 
                backgroundColor: '#f59e0b',
                fontSize: '10px',
                fontWeight: '700',
                borderRadius: '16px',
                boxShadow: `0 2px 8px rgba(245, 158, 11, ${isDarkMode ? '0.5' : '0.3'})`,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }} 
            />
          )}
          {isExpiringSoon && (
            <Badge 
              count={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={12} />
                  <span>Expiring Soon</span>
                </div>
              } 
              style={{ 
                backgroundColor: '#ef4444',
                fontSize: '10px',
                fontWeight: '700',
                borderRadius: '16px',
                boxShadow: `0 2px 8px rgba(239, 68, 68, ${isDarkMode ? '0.5' : '0.3'})`,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }} 
            />
          )}
        </div>

        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 3 }}>
          <Button
            type="text"
            shape="circle"
            icon={
              <Heart 
                size={18} 
                fill={isLiked ? '#ef4444' : 'transparent'} 
                color={isLiked ? '#ef4444' : themeColors.descriptionColor} 
              />
            }
            onClick={handleWishlist}
            style={{
              width: '40px',
              height: '40px',
              background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: `0 4px 20px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'})`,
              transition: 'all 0.3s ease',
              transform: isLiked ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        </div>

        {medicine.rating && (
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 3 }}>
            <div style={{
              background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '4px 8px',
              border: `1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: `0 4px 20px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'})`,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ color: themeColors.titleColor, fontSize: '12px', fontWeight: '600' }}>
                {medicine.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        <div style={imageContainerStyle}>
          <img 
            src={medicine.imageUrl}
            alt={medicine.name}
            style={imageStyle}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/140x140/${isDarkMode ? '1e293b' : 'e2e8f0'}/${isDarkMode ? '94a3b8' : '64748b'}?text=💊`;
              setImageLoaded(true);
            }}
          />
          {!imageLoaded && (
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '16px',
              background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: themeColors.descriptionColor,
              fontSize: '32px',
            }}>
              <Pill size={48} color={themeColors.descriptionColor} />
            </div>
          )}
        </div>

        <div style={contentStyle}>
          <div>
            <h3 style={titleStyle}>{medicine.name}</h3>
            <p style={descriptionStyle}>{medicine.description}</p>
            
            <div style={priceContainerStyle}>
              <div style={priceStyle}>
                ${medicine.price}
              </div>
              <div style={stockBadgeStyle}>
                {medicine.stock > 0 
                  ? (isLowStock ? `${medicine.stock} left` : `${medicine.stock} in stock`)
                  : 'Out of stock'
                }
              </div>
            </div>

            <div style={metaInfoStyle}>
              <div style={metaItemStyle}>
                <CalendarDays size={14} color="#6366f1" />
                <span>Exp: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
              </div>
              <div style={{ width: '1px', height: '12px', background: themeColors.dividerColor }} />
              <div style={metaItemStyle}>
                <Shield size={14} color="#8b5cf6" />
                <span>{medicine.manufacturer || 'Generic'}</span>
              </div>
            </div>
          </div>

          {medicine.stock > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Button 
                shape="circle" 
                icon={<Minus size={16} />} 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                style={{ width: '32px', height: '32px' }}
              />
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: themeColors.quantityBg,
                borderRadius: '8px',
                fontWeight: '600',
                color: themeColors.quantityColor
              }}>
                {quantity}
              </div>
              <Button 
                shape="circle" 
                icon={<Plus size={16} />} 
                onClick={increaseQuantity}
                disabled={quantity >= medicine.stock}
                style={{ width: '32px', height: '32px' }}
              />
            </div>
          )}

          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />}
            disabled={medicine.stock <= 0}
            style={buttonStyle}
            onClick={handleAddToCart}
            onMouseEnter={(e) => {
              if (medicine.stock > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 30px rgba(59, 130, 246, ${isDarkMode ? '0.7' : '0.5'}), inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = medicine.stock > 0 
                ? `0 4px 20px rgba(59, 130, 246, ${isDarkMode ? '0.6' : '0.4'}), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                : `0 4px 20px rgba(107, 114, 128, ${isDarkMode ? '0.5' : '0.3'})`;
            }}
          >
            {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Pill size={24} color="#3b82f6" />
            <span style={{ fontSize: '20px', fontWeight: '700', color: themeColors.titleColor }}>
              {medicine.name}
            </span>
            {medicine.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ color: themeColors.descriptionColor, fontSize: '14px', fontWeight: '600' }}>
                  {medicine.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button 
            key="share" 
            icon={<Share2 size={16} />} 
            onClick={(e) => {
              e.stopPropagation();
              console.log('Share medicine:', medicine.name);
            }}
            style={{ borderRadius: '8px' }}
          >
            Share
          </Button>,
          <Button key="close" onClick={handleModalClose} style={{ borderRadius: '8px' }}>
            Close
          </Button>,
          <Button 
            key="cart"
            type="primary" 
            icon={<ShoppingCartOutlined />}
            disabled={medicine.stock <= 0}
            onClick={handleAddToCart}
            style={{
              height: '40px',
              borderRadius: '8px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: 'none',
              boxShadow: `0 4px 20px rgba(59, 130, 246, ${isDarkMode ? '0.5' : '0.3'})`,
            }}
          >
            {medicine.stock > 0 ? `Add ${quantity} to Cart` : 'Out of Stock'}
          </Button>
        ]}
        width={800}
        centered
        style={{ borderRadius: '20px', overflow: 'hidden' }}
        bodyStyle={{
          background: themeColors.modalBg,
          color: themeColors.modalText,
          border: `1px solid ${themeColors.modalBorder}`,
        }}
        headerStyle={{
          background: themeColors.modalBg,
          borderBottom: `1px solid ${themeColors.modalBorder}`,
        }}
        footerStyle={{
          background: themeColors.modalBg,
          borderTop: `1px solid ${themeColors.modalBorder}`,
        }}
      > */}
      <Modal
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Pill size={24} color="#3b82f6" />
      <span style={{ fontSize: '20px', fontWeight: '700', color: themeColors.titleColor }}>
        {medicine.name}
      </span>
      {medicine.rating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <span style={{ color: themeColors.descriptionColor, fontSize: '14px', fontWeight: '600' }}>
            {medicine.rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  }
  open={isModalVisible}
  onCancel={handleModalClose}
  footer={[
    <Button 
      key="share" 
      icon={<Share2 size={16} />} 
      onClick={(e) => {
        e.stopPropagation();
        console.log('Share medicine:', medicine.name);
      }}
      style={{ borderRadius: '8px' }}
    >
      Share
    </Button>,
    <Button key="close" onClick={handleModalClose} style={{ borderRadius: '8px' }}>
      Close
    </Button>,
    <Button 
      key="cart"
      type="primary" 
      icon={<ShoppingCartOutlined />}
      disabled={medicine.stock <= 0}
      onClick={handleAddToCart}
      style={{
        height: '40px',
        borderRadius: '8px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        border: 'none',
        boxShadow: `0 4px 20px rgba(59, 130, 246, ${isDarkMode ? '0.5' : '0.3'})`,
      }}
    >
      {medicine.stock > 0 ? `Add ${quantity} to Cart` : 'Out of Stock'}
    </Button>
  ]}
  width={800}
  centered
  styles={{
    body: {
      background: themeColors.modalBg,
      color: themeColors.modalText,
      border: `1px solid ${themeColors.modalBorder}`,
    },
    header: {
      background: themeColors.modalBg,
      borderBottom: `1px solid ${themeColors.modalBorder}`,
    },
    footer: {
      background: themeColors.modalBg,
      borderTop: `1px solid ${themeColors.modalBorder}`,
    },
    content: {
      borderRadius: '20px',
      overflow: 'hidden'
    }
  }}
>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <Image
              src={medicine.imageUrl}
              alt={medicine.name}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'contain',
                borderRadius: '16px',
                background: isDarkMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                padding: '20px',
                border: `1px solid ${themeColors.modalBorder}`,
              }}
              fallback={`https://via.placeholder.com/300x300/${isDarkMode ? '1e293b' : 'e2e8f0'}/${isDarkMode ? '94a3b8' : '64748b'}?text=💊`}
            />
            
            {medicine.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <Button 
                  shape="circle" 
                  icon={<Minus size={16} />} 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  style={{ width: '36px', height: '36px' }}
                />
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: themeColors.quantityBg,
                  borderRadius: '8px',
                  height: '36px',
                  fontWeight: '600',
                  fontSize: '16px',
                  color: themeColors.quantityColor
                }}>
                  Quantity: {quantity}
                </div>
                <Button 
                  shape="circle" 
                  icon={<Plus size={16} />} 
                  onClick={increaseQuantity}
                  disabled={quantity >= medicine.stock}
                  style={{ width: '36px', height: '36px' }}
                />
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Descriptions 
              column={1} 
              bordered
              labelStyle={{
                color: themeColors.descriptionColor,
                fontWeight: '600',
                background: isDarkMode ? '#1e293b' : '#f8fafc'
              }}
              contentStyle={{
                color: themeColors.modalText,
                background: isDarkMode ? '#1e293b' : '#ffffff'
              }}
            >
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Pill size={16} /> Name</span>}>
                {medicine.name}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CircleDollarSign size={16} /> Price</span>}>
                <span style={{ color: '#059669', fontWeight: '700', fontSize: '16px' }}>
                  ${medicine.price}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={16} /> Stock</span>}>
                <span style={{ 
                  color: medicine.stock > 0 ? (isLowStock ? '#f59e0b' : '#059669') : '#ef4444', 
                  fontWeight: '600' 
                }}>
                  {medicine.stock > 0 ? medicine.stock : 'Out of Stock'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarDays size={16} /> Expiry Date</span>}>
                <span style={{ color: isExpiringSoon ? '#ef4444' : themeColors.descriptionColor }}>
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> Manufacturer</span>}>
                {medicine.manufacturer || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FlaskConical size={16} /> Ingredients</span>}>
                {medicine.ingredients?.join(', ') || 'Not specified'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider 
          orientation="left" 
          style={{ 
            fontWeight: '600', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: themeColors.modalText
          }}
        >
          <Eye size={18} /> Description
        </Divider>
        <p style={{ color: themeColors.descriptionText, lineHeight: '1.8' }}>{medicine.description}</p>

        {medicine.dosage && (
          <>
            <Divider 
              orientation="left" 
              style={{ 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: themeColors.modalText
              }}
            >
              <ClipboardList size={18} /> Dosage Information
            </Divider>
            <p style={{ color: themeColors.descriptionText, lineHeight: '1.8' }}>{medicine.dosage}</p>
          </>
        )}

        {medicine.sideEffects && (
          <>
            <Divider 
              orientation="left" 
              style={{ 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: themeColors.modalText
              }}
            >
              <AlertTriangle size={18} /> Side Effects
            </Divider>
            <p style={{ color: themeColors.descriptionText, lineHeight: '1.8' }}>{medicine.sideEffects}</p>
          </>
        )}

        {medicine.rating && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Rate 
              disabled 
              defaultValue={medicine.rating} 
              allowHalf 
              style={{ color: '#f59e0b' }} 
            />
            <span style={{ color: themeColors.descriptionColor }}>
              ({medicine.rating.toFixed(1)})
            </span>
          </div>
        )}
      </Modal>
    </>
  );
}

export default PublicMedicineCard;