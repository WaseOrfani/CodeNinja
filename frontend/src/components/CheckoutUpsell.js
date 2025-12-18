import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Upsell-Regeln nach Kategorie
const UPSELL_RULES = {
  // Burger → Golden Cheese Dip, Fire Mayo, Zesty Lime
  'Burger': [
    { id: 'upsell-cheese-dip', name: 'Golden Cheese Dip', price: 3.90, emoji: '🧀' },
    { id: 'upsell-fire-mayo', name: 'Fire Mayo 🌶️', price: 1.50, emoji: '🌶️' },
    { id: 'upsell-zesty-lime', name: 'Zesty Lime', price: 1.50, emoji: '🍋' },
  ],
  // Bowls/Salate → Green Ranch, Creamy Tang, Hausgemachte Limo
  'Bowls': [
    { id: 'upsell-green-ranch', name: 'Green Ranch', price: 1.50, emoji: '🥗' },
    { id: 'upsell-creamy-tang', name: 'Creamy Tang', price: 1.50, emoji: '🥫' },
    { id: 'upsell-limo', name: 'Citrus Glow', price: 3.90, emoji: '🍋', isDrink: true },
  ],
  'Salate': [
    { id: 'upsell-green-ranch', name: 'Green Ranch', price: 1.50, emoji: '🥗' },
    { id: 'upsell-creamy-tang', name: 'Creamy Tang', price: 1.50, emoji: '🥫' },
    { id: 'upsell-limo', name: 'Citrus Glow', price: 3.90, emoji: '🍋', isDrink: true },
  ],
  // Sides → Golden Cheese Dip, Melted Gold, Smoky Charm BBQ
  'Sides': [
    { id: 'upsell-cheese-dip', name: 'Golden Cheese Dip', price: 3.90, emoji: '🧀' },
    { id: 'upsell-melted-gold', name: 'Melted Gold', price: 1.50, emoji: '🧀' },
    { id: 'upsell-smoky-bbq', name: 'Smoky Charm BBQ', price: 1.50, emoji: '🔥' },
  ],
};

// Getränke-Empfehlungen (nur wenn kein Getränk im Warenkorb)
const DRINK_UPSELLS = [
  { id: 'upsell-citrus', name: 'Citrus Glow', price: 3.90, emoji: '🍋', isDrink: true },
  { id: 'upsell-raspberry', name: 'Raspberry Spark', price: 4.70, emoji: '🍓', isDrink: true },
];

// Alkohol-Empfehlung (optional, max 1, nicht bei Kids)
const ALCOHOL_UPSELL = { 
  id: 'upsell-beer', 
  name: 'Bitburger alkoholfrei', 
  price: 4.50, 
  emoji: '🍺', 
  isAlcohol: true 
};

const UPSELL_THRESHOLD = 25; // Keine Anzeige bei Warenkorb ≥ 25 €
const MAX_UPSELLS = 3;
const MAX_DRINK_UPSELLS = 2;

export const CheckoutUpsell = ({ items, cartTotal }) => {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());
  
  // Analyse des Warenkorbs
  const cartAnalysis = useMemo(() => {
    const categories = new Set();
    let hasDrink = false;
    let hasKidsProduct = false;
    
    items.forEach(item => {
      const name = item.product_name?.toLowerCase() || '';
      
      // Kategorie erkennen
      if (name.includes('burger') || name.includes('smash') || 
          name.includes('chicken') || name.includes('angel') ||
          name.includes('cheese fire') || name.includes('bbq boss') ||
          name.includes('holy cheese') || name.includes('plant power')) {
        categories.add('Burger');
      }
      if (name.includes('bowl')) {
        categories.add('Bowls');
      }
      if (name.includes('salat') || name.includes('salad')) {
        categories.add('Salate');
      }
      if (name.includes('fries') || name.includes('pommes') || 
          name.includes('onion') || name.includes('nuggets')) {
        categories.add('Sides');
      }
      
      // Getränk erkennen
      if (name.includes('limo') || name.includes('cola') || 
          name.includes('fanta') || name.includes('sprite') ||
          name.includes('wasser') || name.includes('tee') ||
          name.includes('kaffee') || name.includes('espresso') ||
          name.includes('citrus') || name.includes('raspberry') ||
          name.includes('ginger') || name.includes('bier') ||
          name.includes('schorle')) {
        hasDrink = true;
      }
      
      // Kids erkennen
      if (name.includes('kids') || name.includes('little bite') ||
          name.includes('kinder')) {
        hasKidsProduct = true;
      }
    });
    
    return { categories: Array.from(categories), hasDrink, hasKidsProduct };
  }, [items]);

  // Upsells basierend auf Warenkorb-Analyse sammeln
  const suggestedUpsells = useMemo(() => {
    const upsells = [];
    const seenIds = new Set();
    
    // 1. Kategorie-basierte Upsells hinzufügen
    cartAnalysis.categories.forEach(category => {
      const categoryUpsells = UPSELL_RULES[category] || [];
      categoryUpsells.forEach(upsell => {
        if (!seenIds.has(upsell.id) && upsells.length < MAX_UPSELLS) {
          // Getränke-Upsell nur wenn kein Getränk im Warenkorb
          if (upsell.isDrink && cartAnalysis.hasDrink) return;
          
          seenIds.add(upsell.id);
          upsells.push(upsell);
        }
      });
    });
    
    // 2. Getränke-Empfehlungen (nur wenn kein Getränk im Warenkorb, max 2)
    if (!cartAnalysis.hasDrink && upsells.length < MAX_UPSELLS) {
      let drinkCount = 0;
      DRINK_UPSELLS.forEach(drink => {
        if (!seenIds.has(drink.id) && 
            upsells.length < MAX_UPSELLS && 
            drinkCount < MAX_DRINK_UPSELLS) {
          seenIds.add(drink.id);
          upsells.push(drink);
          drinkCount++;
        }
      });
    }
    
    // 3. Alkohol-Empfehlung (optional, max 1, nicht bei Kids)
    if (!cartAnalysis.hasKidsProduct && 
        !seenIds.has(ALCOHOL_UPSELL.id) && 
        upsells.length < MAX_UPSELLS &&
        cartAnalysis.categories.includes('Burger')) {
      // Nur bei Burger-Bestellungen Alkohol vorschlagen
      // Kommentiert aus - nur aktivieren wenn gewünscht
      // upsells.push(ALCOHOL_UPSELL);
    }
    
    return upsells.slice(0, MAX_UPSELLS);
  }, [cartAnalysis]);

  // Keine Anzeige bei Warenkorb ≥ 25 €
  if (cartTotal >= UPSELL_THRESHOLD) return null;

  const handleAddUpsell = (upsell) => {
    const extraProduct = {
      id: upsell.id,
      name: upsell.name,
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
      variants: [{ name: 'Portion', price: upsell.price }],
    };
    
    addItem(extraProduct, { name: 'Portion', price: upsell.price }, [], 1);
    setAddedItems(prev => new Set([...prev, upsell.id]));
  };

  if (suggestedUpsells.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-amber-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span>✨</span> Dazu passt gut
        </h3>
        {cartTotal < UPSELL_THRESHOLD && (
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            Noch €{(UPSELL_THRESHOLD - cartTotal).toFixed(2)} bis €{UPSELL_THRESHOLD}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {suggestedUpsells.map((upsell) => {
          const isAdded = addedItems.has(upsell.id);
          return (
            <div 
              key={upsell.id}
              className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-100 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{upsell.emoji}</span>
                <div>
                  <p className="font-medium text-slate-900">{upsell.name}</p>
                  <p className="text-sm text-amber-600 font-medium">
                    {upsell.price === 0 ? 'Inklusive' : `+€${upsell.price.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddUpsell(upsell)}
                disabled={isAdded}
                className={`rounded-full min-w-[120px] ${
                  isAdded 
                    ? 'bg-green-100 text-green-700 cursor-default' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
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
