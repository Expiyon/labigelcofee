import {
  GiCoffeeCup,
  GiTeapotLeaves,
  GiCupcake,
  GiIceCreamCone,
  GiHamburger,
  GiSandwich,
  GiSteak,
  GiChickenLeg,
  GiHotMeal,
  GiNoodles,
  GiSodaCan,
  GiMartini,
  GiBeerBottle,
  GiWineBottle,
  GiFruitBowl,
  GiFriedEggs,
  GiPopcorn,
  GiForkKnifeSpoon,
} from 'react-icons/gi';
import { IconType } from 'react-icons';

const KEYWORD_ICONS: [string[], IconType][] = [
  [['kahve', 'coffee', 'espresso', 'latte'], GiCoffeeCup],
  [['çay', 'cay', 'tea'], GiTeapotLeaves],
  [['tatlı', 'tatli', 'dessert', 'pasta', 'kek'], GiCupcake],
  [['dondurma', 'ice cream'], GiIceCreamCone],
  [['burger', 'hamburger'], GiHamburger],
  [['tost', 'sandviç', 'sandvic', 'sandwich'], GiSandwich],
  [['et', 'steak', 'kebap', 'kebab'], GiSteak],
  [['tavuk', 'chicken'], GiChickenLeg],
  [['çorba', 'corba', 'soup'], GiHotMeal],
  [['makarna', 'noodle', 'pasta'], GiNoodles],
  [['içecek', 'icecek', 'soda', 'gazoz', 'soğuk', 'sogus'], GiSodaCan],
  [['kokteyl', 'cocktail'], GiMartini],
  [['bira', 'beer'], GiBeerBottle],
  [['şarap', 'sarap', 'wine', 'rakı', 'raki'], GiWineBottle],
  [['meyve', 'fruit'], GiFruitBowl],
  [['kahvaltı', 'kahvalti', 'güne başlarken', 'gune baslarken', 'breakfast', 'omlet', 'yumurta'], GiFriedEggs],
  [['atıştırmalık', 'atistirmalik', 'snack', 'popcorn'], GiPopcorn],
];

export function getCategoryIcon(name: string): IconType {
  const normalized = name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  for (const [keywords, Icon] of KEYWORD_ICONS) {
    if (keywords.some((k) => normalized.includes(k))) {
      return Icon;
    }
  }
  return GiForkKnifeSpoon;
}
