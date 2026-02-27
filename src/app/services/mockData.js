// Mock product data for development
// This can be used if the backend is not available

export const mockProducts = [
  {
    id: 1,
    name: 'SHADOW HOODIE',
    description: 'Premium oversized hoodie with embroidered logo. Heavy cotton blend for ultimate comfort.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1588011025378-15f4778d2558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzcyMDgwMDMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'hoodies',
  },
  {
    id: 2,
    name: 'URBAN BOMBER',
    description: 'Lightweight bomber jacket with premium finish. Perfect for layering.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1550948506-9a85c307d4a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGphY2tldCUyMGZhc2hpb258ZW58MXx8fHwxNzcyMTIyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'jackets',
  },
  {
    id: 3,
    name: 'GHOST SNEAKERS',
    description: 'Limited edition sneakers with unique design. Premium materials and comfort.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1669671943625-e20799ee5f42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwc25lYWtlcnN8ZW58MXx8fHwxNzcyMTIyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    category: 'footwear',
  },
  {
    id: 4,
    name: 'MINIMAL TEE',
    description: 'Essential black tee with premium cotton. Minimal branding for maximum style.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1596122787821-95c4255bb936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzcyMDc0NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'tshirts',
  },
  {
    id: 5,
    name: 'RAW DENIM',
    description: 'Premium raw denim jeans. Classic fit with modern details.',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1635815171008-5f1b358bb2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwdXJiYW58ZW58MXx8fHwxNzcyMTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['28', '30', '32', '34', '36', '38'],
    category: 'pants',
  },
  {
    id: 6,
    name: 'STREET CAP',
    description: 'Premium baseball cap with embroidered logo. Adjustable strap.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1768489039458-b499a027fbf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzcyMTIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    sizes: ['One Size'],
    category: 'accessories',
  },
];

// Mock API responses
export const mockApiResponses = {
  getProducts: () => Promise.resolve(mockProducts),
  getProductById: (id) => {
    const product = mockProducts.find((p) => p.id === parseInt(id));
    if (product) {
      return Promise.resolve(product);
    }
    return Promise.reject(new Error('Product not found'));
  },
  createOrder: (orderData) => {
    console.log('Mock Order Created:', orderData);
    return Promise.resolve({
      success: true,
      orderId: Math.random().toString(36).substr(2, 9),
      message: 'Order created successfully',
    });
  },
};
