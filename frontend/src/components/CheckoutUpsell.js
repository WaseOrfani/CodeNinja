import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Upsell-Regeln: Welche Produkte triggern welche Extras
const UPSELL_RULES = {
  // Burger-Kategorien -> Käse, Sauce, Bacon
  'Smash Burger': [
    { id: 'upsell-cheese', name: 'Extra Käse', price: 1.50, emoji: '🧀' },
    { id: 'upsell-sauce', name: 'Truffle Mayo', price: 1.80, emoji: '🥫' },
    { id: 'upsell-jalapeno', name: 'Jalapeños', price: 1.00, emoji: '🌶️' },
  ],
  // Chicken -> Sauce, Coleslaw
  'Chicken & Veggie': [
    { id: 'upsell-sauce-chicken', name: 'Extra Sauce', price: 0.80, emoji: '🥫' },
    { id: 'upsell-cheese', name: 'Extra Käse', price: 1.50, emoji: '🧀' },
  ],
  // Bowls -> Protein, Dressing
  'Bowls & Salads': [
    { id: 'upsell-protein', name: 'Extra Protein', price: 3.00, emoji: '🍗' },
    { id: 'upsell-dressing', name: 'Extra Dressing', price: 0.80, emoji: '🥗' },
    { id: 'upsell-avocado', name: 'Avocado', price: 2.00, emoji: '🥑' },
  ],
  // Sides -> Cheese topping
  'Sides': [
    { id: 'upsell-cheese-fries', name: 'Cheese Topping', price: 1.50, emoji: '🧀' },
    { id: 'upsell-bacon', name: 'Bacon Bits', price: 1.80, emoji: '🥓' },
  ],
  // Kids -> keine Upsells
  'Kids': [],
  // Drinks -> Size upgrade
  'Drinks': [
    { id: 'upsell-size', name: 'Größe upgrade', price: 1.00, emoji: '📏' },
  ],
};

const UPSELL_THRESHOLD = 25; // Only show upsell if cart < €25

export const CheckoutUpsell = ({ items, cartTotal }) => {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());
  
  // Don't show upsell if cart is already above threshold
  if (cartTotal >= UPSELL_THRESHOLD) return null;

  // Determine which upsells to show based on cart items
  const suggestedUpsells = useMemo(() => {
    const categorySet = new Set();
    items.forEach(item => {
      // Try to find matching category from item name/variant
      Object.keys(UPSELL_RULES).forEach(category => {
        if (item.product_name?.toLowerCase().includes('smash') || 
            item.product_name?.toLowerCase().includes('burger')) {
          categorySet.add('Smash Burger');
        } else if (item.product_name?.toLowerCase().includes('chicken') || 
                   item.product_name?.toLowerCase().includes('veggie')) {
          categorySet.add('Chicken & Veggie');
        } else if (item.product_name?.toLowerCase().includes('bowl') || 
                   item.product_name?.toLowerCase().includes('salad')) {
          categorySet.add('Bowls & Salads');
        } else if (item.product_name?.toLowerCase().includes('fries') || 
                   item.product_name?.toLowerCase().includes('onion')) {
          categorySet.add('Sides');
        }
      });
    });

    // Collect all matching upsells, max 3
    const upsells = [];
    const seenIds = new Set();
    
    categorySet.forEach(category => {
      const categoryUpsells = UPSELL_RULES[category] || [];
      categoryUpsells.forEach(upsell => {
        if (!seenIds.has(upsell.id) && upsells.length < 3) {
          seenIds.add(upsell.id);
          upsells.push({ ...upsell, category });
        }
      });
    });

    return upsells;
  }, [items]);

  const handleAddUpsell = (upsell) => {
    // Create a simple "extra" item
    const extraProduct = {
      id: upsell.id,
      name: upsell.name,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      variants: [{ name: 'Extra', price: upsell.price }],
    };
    
    addItem(extraProduct, { name: 'Extra', price: upsell.price }, [], 1);
    setAddedItems(prev => new Set([...prev, upsell.id]));
  };

  if (suggestedUpsells.length === 0) return null;

  const remainingForThreshold = UPSELL_THRESHOLD - cartTotal;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span>✨</span> Dazu passt perfekt
        </h3>
        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
          Noch €{remainingForThreshold.toFixed(2)} bis €{UPSELL_THRESHOLD}
        </span>
      </div>
      <div className="space-y-2">
        {suggestedUpsells.map((upsell) => {
          const isAdded = addedItems.has(upsell.id);
          return (
            <div 
              key={upsell.id}
              className="flex items-center justify-between bg-white rounded-xl p-3 border border-green-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{upsell.emoji}</span>
                <div>
                  <p className="font-medium text-slate-900">{upsell.name}</p>
                  <p className="text-sm text-green-600 font-medium">+€{upsell.price.toFixed(2)}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddUpsell(upsell)}
                disabled={isAdded}
                className={`rounded-full ${
                  isAdded 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                data-testid={`upsell-add-${upsell.id}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Hinzugefügt
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Hinzufügen
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutUpsell;
