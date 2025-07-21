
import { useState } from 'react';
import { Button, Badge, Modal, Descriptions, Image, Rate, Divider, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
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
  Shield,
  Plus,
  Minus,
  Share2,
  ClipboardList
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFirebaseCart } from '../context/FirebaseCartContext';

function PublicMedicineCard({ medicine }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { isDarkMode } = useTheme();
  // const { addToCart } = useCart();
   const { addToCart } = useFirebaseCart();

  const handleAddToCart = async (e) => {
  e.stopPropagation(); // Prevent modal from opening when clicking the button
  try {
    await addToCart({
      ...medicine,
      quantity: quantity // Include the selected quantity
    });
    message.success(`${quantity} ${medicine.name} added to cart!`);
  } catch (error) {
    message.error('Failed to add to cart');
    console.error('Add to cart error:', error);
  }
};


  const isLowStock = medicine.stock <= 5 && medicine.stock > 0;
  const isExpiringSoon = new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const showModal = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);


  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    message.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.min(prev + 1, medicine.stock));
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <>
      {/* Medicine Card */}
      <div 
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] w-full max-w-xs mx-auto mb-4 min-h-[480px]
          ${isDarkMode ? 
            'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/60' : 
            'bg-gradient-to-br from-white to-slate-50 border border-slate-200/60'
          }
          ${isHovered ? 'transform -translate-y-2 scale-[1.02]' : 'transform translate-y-0 scale-100'}
          ${isHovered ? 
            (isDarkMode ? 
              'shadow-[0_25px_50px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]' : 
              'shadow-[0_25px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]'
            ) : 
            (isDarkMode ? 
              'shadow-[0_4px_20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)]' : 
              'shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)]'
            )
          }
          backdrop-filter backdrop-blur-xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={showModal}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-500/10 transition-opacity duration-400 ease-in-out pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {isLowStock && (
            <Badge 
              count={
                <div className="flex items-center gap-1">
                  <Zap size={12} />
                  <span>Low Stock</span>
                </div>
              } 
              className="bg-amber-500 text-xs font-bold rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.3)] border border-white/20" 
            />
          )}
          {isExpiringSoon && (
            <Badge 
              count={
                <div className="flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>Expiring Soon</span>
                </div>
              } 
              className="bg-red-500 text-xs font-bold rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)] border border-white/20" 
            />
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 left-4 z-30">
          <Button
            type="text"
            shape="circle"
            icon={
              <Star 
                size={18} 
                fill={isLiked ? '#f59e0b' : 'transparent'} 
                className={isLiked ? 'text-amber-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')} 
              />
            }
            onClick={handleWishlist}
            className={`w-10 h-10 transition-all duration-300 ease-in-out
              ${isDarkMode ? 
                'bg-slate-800/95 backdrop-blur-xl border border-slate-600/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 
                'bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
              }
              ${isLiked ? 'scale-110' : 'scale-100'}`}
          />
        </div>

        {/* Rating */}
        {medicine.rating && (
          <div className="absolute bottom-4 right-4 z-30">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-xl backdrop-blur-xl border
              ${isDarkMode ? 
                'bg-slate-800/95 border-slate-600/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 
                'bg-white/95 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
              }`}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>
                {medicine.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className={`relative w-full h-48 overflow-hidden transition-all duration-400 ease-in-out flex items-center justify-center
          ${isHovered ? 
            'bg-gradient-to-br from-indigo-500 to-purple-600' : 
            'bg-gradient-to-br from-purple-300 to-pink-500'
          }`}>
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            preview={false}
            className={`w-36 h-36 object-contain rounded-2xl p-4 backdrop-blur-sm border
              ${isDarkMode ? 
                'bg-slate-800/95 border-slate-600/20' : 
                'bg-white/95 border-white/20'
              }
              transition-all duration-400 ease-in-out
              ${isHovered ? 'scale-105 rotate-2' : 'scale-100 rotate-0'}
              shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
            fallback={`https://via.placeholder.com/140x140/${isDarkMode ? '1e293b' : 'e2e8f0'}/${isDarkMode ? '94a3b8' : '64748b'}?text=💊`}
          />
        </div>

        {/* Content */}
        <div className="p-6 h-72 flex flex-col justify-between">
          <div>
            <h3 className={`text-lg font-bold mb-2 leading-tight tracking-tight ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>
              {medicine.name}
            </h3>
            <p className={`text-sm leading-relaxed mb-4 font-normal line-clamp-2 
              ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {medicine.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-extrabold bg-gradient-to-br from-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                Rs{medicine.price}
              </div>
              <div className={`text-xs font-semibold rounded-xl px-3 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.15)] border-none
                ${medicine.stock > 0 ? 
                  (isLowStock ? 
                    'bg-gradient-to-br from-amber-500 to-amber-600 text-white' : 
                    'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                  ) : 
                  'bg-gradient-to-br from-red-500 to-red-600 text-white'
                }`}>
                {medicine.stock > 0 
                  ? (isLowStock ? `${medicine.stock} left` : `${medicine.stock} in stock`)
                  : 'Out of stock'
                }
              </div>
            </div>

            <div className={`flex items-center gap-3 mb-5 p-3 rounded-xl border
              ${isDarkMode ? 
                'bg-slate-900/80 border-slate-600/50' : 
                'bg-slate-50/80 border-slate-200/50'
              }`}>
              <div className={`flex items-center gap-1 text-xs font-medium
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <CalendarDays size={14} color="#6366f1" />
                <span>Exp: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className={`w-px h-3 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`} />
              <div className={`flex items-center gap-1 text-xs font-medium
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Shield size={14} color="#8b5cf6" />
                {/* <span>{medicine.manufacturer || 'Generic'}</span> */}
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          {medicine.stock > 0 && (
            <div className="flex gap-2 mb-3">
              <Button 
                shape="circle" 
                icon={<Minus size={16} />} 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8"
              />
              <div className={`flex-1 flex items-center justify-center rounded-md font-semibold
                ${isDarkMode ? 
                  'bg-slate-800/50 text-slate-200' : 
                  'bg-slate-100/50 text-slate-800'
                }`}>
                {quantity}
              </div>
              <Button 
                shape="circle" 
                icon={<Plus size={16} />} 
                onClick={increaseQuantity}
                disabled={quantity >= medicine.stock}
                className="w-8 h-8"
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />}
            disabled={medicine.stock <= 0}
            onClick={handleAddToCart}
            // onClick={() => addToCart(medicine)}
            className={`w-full h-12 rounded-2xl text-sm font-bold border-none transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] tracking-wide text-white
              ${medicine.stock > 0 ? 
                'bg-gradient-to-br from-blue-500 to-blue-700  py-1.5 shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]' : 
                'bg-gradient-to-br from-gray-500 to-gray-600 shadow-[0_4px_20px_rgba(107,114,128,0.3)]'
              }
              hover:transform hover:-translate-y-0.5
              ${medicine.stock > 0 ? 
                'hover:shadow-[0_8px_30px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]' : 
                ''
              }`}
          >
            {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Medicine Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Pill size={24} color="#3b82f6" />
            <span className={`text-xl font-bold ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}>
              {medicine.name}
            </span>
            {medicine.rating && (
              <div className="flex items-center gap-1">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
              navigator.clipboard.writeText(window.location.href);
              message.success('Link copied to clipboard!');
            }}
            className="rounded-lg"
          >
            Share
          </Button>,
          <Button key="close" onClick={handleModalClose} className="rounded-lg">
            Close
          </Button>,
          <Button 
            key="cart"
            type="primary" 
            icon={<ShoppingCartOutlined />}
            disabled={medicine.stock <= 0}
            onClick={handleAddToCart}
            // onClick={() => addToCart(medicine)}
            className="h-10 rounded-lg font-semibold border-none bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
          >
            {medicine.stock > 0 ? `Add ${quantity} to Cart` : 'Out of Stock'}
          </Button>
        ]}
        width="90%"
        maxWidth={800}
        centered
        className={`[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:overflow-hidden
          ${isDarkMode ? 
            '[&_.ant-modal-header]:bg-slate-800 [&_.ant-modal-header]:border-slate-700' : 
            '[&_.ant-modal-header]:bg-white [&_.ant-modal-header]:border-slate-200'
          }
          ${isDarkMode ? 
            '[&_.ant-modal-body]:bg-slate-800 [&_.ant-modal-body]:text-slate-50 [&_.ant-modal-body]:border-slate-700' : 
            '[&_.ant-modal-body]:bg-white [&_.ant-modal-body]:text-slate-800 [&_.ant-modal-body]:border-slate-200'
          }
          ${isDarkMode ? 
            '[&_.ant-modal-footer]:bg-slate-800 [&_.ant-modal-footer]:border-slate-700' : 
            '[&_.ant-modal-footer]:bg-white [&_.ant-modal-footer]:border-slate-200'
          }`}
      >
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <Image
              src={medicine.imageUrl}
              alt={medicine.name}
              preview={false}
              className={`w-full h-72 object-contain rounded-2xl p-5 border
                ${isDarkMode ? 
                  'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' : 
                  'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                }`}
              fallback={`https://via.placeholder.com/300x300/${isDarkMode ? '1e293b' : 'e2e8f0'}/${isDarkMode ? '94a3b8' : '64748b'}?text=💊`}
            />
            
            {medicine.stock > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <Button 
                  shape="circle" 
                  icon={<Minus size={16} />} 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-9 h-9"
                />
                <div className={`flex-1 flex items-center justify-center h-9 rounded-md font-semibold text-base
                  ${isDarkMode ? 
                    'bg-slate-800/50 text-slate-200' : 
                    'bg-slate-100/50 text-slate-800'
                  }`}>
                  Quantity: {quantity}
                </div>
                <Button 
                  shape="circle" 
                  icon={<Plus size={16} />} 
                  onClick={increaseQuantity}
                  disabled={quantity >= medicine.stock}
                  className="w-9 h-9"
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Descriptions 
              column={1} 
              bordered
              className={`[&_.ant-descriptions-item-label]:font-semibold
                ${isDarkMode ? 
                  '[&_.ant-descriptions-item-label]:bg-slate-800 [&_.ant-descriptions-item-label]:text-slate-400' : 
                  '[&_.ant-descriptions-item-label]:bg-slate-50 [&_.ant-descriptions-item-label]:text-slate-500'
                }
                ${isDarkMode ? 
                  '[&_.ant-descriptions-item-content]:bg-slate-800 [&_.ant-descriptions-item-content]:text-slate-50' : 
                  '[&_.ant-descriptions-item-content]:bg-white [&_.ant-descriptions-item-content]:text-slate-800'
                }`}
            >
              <Descriptions.Item label={<span className="flex items-center gap-2"><Pill size={16} /> Name</span>}>
                {medicine.name}
              </Descriptions.Item>
              <Descriptions.Item label={<span className="flex items-center gap-2"><CircleDollarSign size={16} /> Price</span>}>
                <span className="text-emerald-600 font-bold text-base">
                  Rs{medicine.price}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="flex items-center gap-2"><Package size={16} /> Stock</span>}>
                <span className={`font-semibold
                  ${medicine.stock > 0 ? 
                    (isLowStock ? 'text-amber-500' : 'text-emerald-600') : 
                    'text-red-500'
                  }`}>
                  {medicine.stock > 0 ? medicine.stock : 'Out of Stock'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="flex items-center gap-2"><CalendarDays size={16} /> Expiry Date</span>}>
                <span className={isExpiringSoon ? 'text-red-500' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </span>
              </Descriptions.Item>
            </Descriptions> 
          </div>
        </div>

        <Divider 
          orientation="left" 
          className={`font-semibold flex items-center gap-2
            ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}
        >
          <Eye size={18} /> Description
        </Divider>
        <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {medicine.description}
        </p>

        {medicine.dosage && (
          <>
            <Divider 
              orientation="left" 
              className={`font-semibold flex items-center gap-2
                ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}
            >
              <ClipboardList size={18} /> Dosage Information
            </Divider>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {medicine.dosage}
            </p>
          </>
        )}

        {medicine.sideEffects && (
          <>
            <Divider 
              orientation="left" 
              className={`font-semibold flex items-center gap-2
                ${isDarkMode ? 'text-slate-50' : 'text-slate-800'}`}
            >
              <AlertTriangle size={18} /> Side Effects
            </Divider>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {medicine.sideEffects}
            </p>
          </>
        )}

        {medicine.rating && (
          <div className="mt-4 flex items-center gap-3">
            <Rate 
              disabled 
              defaultValue={medicine.rating} 
              allowHalf 
              className="text-amber-500" 
            />
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
              ({medicine.rating.toFixed(1)})
            </span>
          </div>
        )}
      </Modal>
    </>
  );
}

export default PublicMedicineCard;