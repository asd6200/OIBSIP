const User = require('../models/User');
const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

const autoSeedIfEmpty = async () => {
  try {
    const pizzaCount = await Pizza.countDocuments();
    if (pizzaCount > 0) {
      console.log(`ℹ️ Database already populated (${pizzaCount} pizzas found). Skipping auto-seed.`);
      return;
    }

    console.log('🌱 Empty database detected! Running automatic initial seeding...');

    // Seed Users
    const adminExists = await User.findOne({ email: 'admin@royalpizza.com' });
    if (!adminExists) {
      await User.create({
        name: 'Royal Admin',
        email: 'admin@royalpizza.com',
        password: 'adminpassword',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Auto-seeded Admin: admin@royalpizza.com (password: adminpassword)');
    }

    const userExists = await User.findOne({ email: 'user@royalpizza.com' });
    if (!userExists) {
      await User.create({
        name: 'Asd',
        email: 'user@royalpizza.com',
        password: 'userpassword',
        role: 'user',
        isVerified: true,
        walletPoints: 100,
        address: '155, Patliputra Colony, Patna, Bihar, 800001, India',
      });
      console.log('✅ Auto-seeded User: user@royalpizza.com (password: userpassword)');
    }

    // Seed Inventory (5 Bases, 5 Sauces, Cheeses, Veggies)
    const inventoryCount = await Inventory.countDocuments();
    if (inventoryCount === 0) {
      const inventoryItems = [
        // 5 Bases
        { name: 'Thin Crust', category: 'base', stock: 50, minThreshold: 20, unitPrice: 40 },
        { name: 'Hand Tossed', category: 'base', stock: 60, minThreshold: 20, unitPrice: 50 },
        { name: 'Cheese Burst', category: 'base', stock: 40, minThreshold: 20, unitPrice: 70 },
        { name: 'Pan Pizza', category: 'base', stock: 45, minThreshold: 20, unitPrice: 45 },
        { name: 'Whole Wheat Crust', category: 'base', stock: 15, minThreshold: 20, unitPrice: 60 },

        // 5 Sauces
        { name: 'Classic Tomato Sauce', category: 'sauce', stock: 80, minThreshold: 20, unitPrice: 20 },
        { name: 'Barbeque Sauce', category: 'sauce', stock: 75, minThreshold: 20, unitPrice: 25 },
        { name: 'Peri Peri Sauce', category: 'sauce', stock: 65, minThreshold: 20, unitPrice: 25 },
        { name: 'Garlic Parmesan Sauce', category: 'sauce', stock: 50, minThreshold: 20, unitPrice: 30 },
        { name: 'Spicy Schezwan Sauce', category: 'sauce', stock: 18, minThreshold: 20, unitPrice: 25 },

        // Cheeses
        { name: 'Mozzarella Cheese', category: 'cheese', stock: 90, minThreshold: 20, unitPrice: 50 },
        { name: 'Cheddar Cheese', category: 'cheese', stock: 60, minThreshold: 20, unitPrice: 55 },
        { name: 'Ricotta Cheese', category: 'cheese', stock: 40, minThreshold: 20, unitPrice: 60 },
        { name: 'Cream Cheese', category: 'cheese', stock: 35, minThreshold: 20, unitPrice: 50 },
        { name: 'Vegan Cheese', category: 'cheese', stock: 30, minThreshold: 20, unitPrice: 65 },

        // Veggies
        { name: 'Jalapenos', category: 'veggie', stock: 100, minThreshold: 25, unitPrice: 15 },
        { name: 'Black Olives', category: 'veggie', stock: 85, minThreshold: 25, unitPrice: 20 },
        { name: 'Crisp Capsicum', category: 'veggie', stock: 95, minThreshold: 25, unitPrice: 15 },
        { name: 'Red Paprika', category: 'veggie', stock: 70, minThreshold: 25, unitPrice: 20 },
        { name: 'Sweet Corn', category: 'veggie', stock: 110, minThreshold: 25, unitPrice: 15 },
        { name: 'Fresh Mushroom', category: 'veggie', stock: 55, minThreshold: 25, unitPrice: 25 },
        { name: 'Golden Onions', category: 'veggie', stock: 120, minThreshold: 25, unitPrice: 10 },
        { name: 'Tomatoes', category: 'veggie', stock: 100, minThreshold: 25, unitPrice: 10 },

        // Quick Addons
        { name: 'Water Bottle 500 ml', category: 'addon', stock: 200, minThreshold: 30, unitPrice: 19.05 },
        { name: 'Lahori Zeera', category: 'addon', stock: 150, minThreshold: 30, unitPrice: 19.05 },
      ];
      await Inventory.insertMany(inventoryItems);
      console.log('✅ Auto-seeded Inventory Items');
    }

    // Seed Menu Pizzas
    const menuPizzas = [
      {
        name: 'Power Chicken tikka',
        category: 'Non-Veg',
        price: 369.0,
        description: 'Italian Crust with all Healthy, Protein, Fiber with Diced Mozzarella, Ricotta Cheese & Tender Chicken Tikka',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
        crust: 'Hand Tossed',
        size: 'Regular',
        isVeg: false,
      },
      {
        name: 'Nutri Crust (High Protein)',
        category: 'Nutri Crust',
        price: 199.0,
        description: 'Made with Whole Grains, Oats & Super Seeds topped with fresh veggies & light cheese',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
        crust: 'Whole Wheat Crust',
        size: 'Medium',
        isVeg: true,
      },
      {
        name: 'Medium Pizza - Margherita',
        category: 'Medium Pizza',
        price: 159.0,
        description: 'Classic 100% Mozzarella cheese with aromatic basil tomato sauce base',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80',
        crust: 'Hand Tossed',
        size: 'Medium',
        isVeg: true,
      },
      {
        name: 'Large Pizza - Feast',
        category: 'Large Pizza',
        price: 289.0,
        description: 'Loaded with paneer, capsicum, sweet corn, onions and extra cheese burst crust',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80',
        crust: 'Cheese Burst',
        size: 'Large',
        isVeg: true,
      },
      {
        name: 'Traditional Veg Pizza',
        category: 'Traditional Veg',
        price: 179.0,
        description: 'Classic Indian style veg delight with onions, crisp capsicum and juicy tomatoes',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
        crust: 'Thin Crust',
        size: 'Regular',
        isVeg: true,
      },
      {
        name: 'Gourmet Pizza',
        category: 'Gourmet',
        price: 249.0,
        description: 'Rich creamy garlic sauce, ricotta cheese, black olives, jalapenos and red paprika',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=80',
        crust: 'Pan Pizza',
        size: 'Medium',
        isVeg: true,
      },
      {
        name: 'Desi Flavour Of India',
        category: 'Desi Flavour',
        price: 229.0,
        description: 'Spicy Schezwan sauce, tandoori paneer, red onions, capsicum & chatpata spices',
        image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop&q=80',
        crust: 'Hand Tossed',
        size: 'Regular',
        isVeg: true,
      },
      {
        name: 'Traditional Non Veg Pizza',
        category: 'Non-Veg',
        price: 299.0,
        description: 'Barbeque sauce, succulent roasted chicken, jalapenos, and melted cheddar',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
        crust: 'Hand Tossed',
        size: 'Medium',
        isVeg: false,
      },
      {
        name: 'Premium Cheesy (100% Dairy)',
        category: 'Cheesy',
        price: 319.0,
        description: 'Quadruple cheese blend: Mozzarella, Cheddar, Ricotta & Cream Cheese burst',
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop&q=80',
        crust: 'Cheese Burst',
        size: 'Medium',
        isVeg: true,
      },
      {
        name: 'Street Style Pizza',
        category: 'Street Style',
        price: 129.0,
        description: 'Desi Mumbai style street pizza topped with sweet corn, onions & cheese',
        image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=500&auto=format&fit=crop&q=80',
        crust: 'Thin Crust',
        size: 'Regular',
        isVeg: true,
      },
    ];

    await Pizza.insertMany(menuPizzas);
    console.log('✅ Auto-seeded Pizza Menu Items');
    console.log('🎉 Automatic seeding complete!');
  } catch (error) {
    console.error('Error during auto-seed check:', error.message);
  }
};

module.exports = { autoSeedIfEmpty };
