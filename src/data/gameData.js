export const CATEGORIES = [
  {
    id: 1,
    name: "HOUSING & UTILITIES",
    required: true,
    color: "red",
    items: [
      { id: 1, name: "Live with relatives & share utilities", cost: 2 },
      {
        id: 2,
        name: "Apartment with roommates, shared room and utilities",
        cost: 3,
      },
      { id: 3, name: "Apartment of your own", cost: 4 },
    ],
  },
  {
    id: 2,
    name: "INSURANCE",
    required: true,
    color: "red",
    items: [
      { id: 4, name: "CAR: Liability Only", cost: 2 },
      { id: 5, name: "CAR: Full Coverage", cost: 3 },
      { id: 6, name: "HEALTH: None", cost: 0, isCheckbox: true },
      { id: 7, name: "HEALTH: Job Accident Coverage", cost: 1 },
      { id: 8, name: "HEALTH: Full Health Coverage", cost: 2 },
      { id: 9, name: "HOME: Home or Renters Insurance", cost: 1 },
    ],
  },
  {
    id: 3,
    name: "PHONE & INTERNET",
    required: false,
    color: "blue",
    items: [
      { id: 10, name: "Basic phone", cost: 1 },
      { id: 11, name: "New iPhone with Apple music", cost: 2 },
      { id: 12, name: "Shared internet, slower speed", cost: 1 },
      { id: 13, name: "Fast internet, ideal for streaming video", cost: 2 },
    ],
  },
  {
    id: 4,
    name: "GIFTS",
    required: false,
    color: "green",
    items: [
      { id: 14, name: "Make gifts", cost: 1 },
      { id: 15, name: "Buy small gifts occasionally", cost: 2 },
      { id: 16, name: "Buy gifts often", cost: 3 },
    ],
  },
  {
    id: 5,
    name: "SAVINGS",
    required: false,
    color: "purple",
    items: [
      { id: 17, name: "Piggy bank", cost: 0, isCheckbox: true },
      { id: 18, name: "5% of income", cost: 1 },
      { id: 19, name: "10% of income", cost: 2 },
      { id: 20, name: "Invest for retirement", cost: 1 },
      { id: 21, name: "10% to charity or tithes", cost: 2 },
    ],
  },
  {
    id: 6,
    name: "FURNITURE & HOUSEWARES",
    required: true,
    color: "red",
    items: [
      {
        id: 22,
        name: "Use hand-me-downs from fam/friends",
        cost: 0,
        isCheckbox: true,
      },
      {
        id: 23,
        name: "Rent furniture or live in furnished apartment",
        cost: 1,
      },
      { id: 24, name: "Buy secondhand at yard sales/thrift stores", cost: 1 },
      { id: 25, name: "Buy new furniture", cost: 2 },
    ],
  },
  {
    id: 7,
    name: "FUN",
    required: false,
    color: "green",
    items: [
      {
        id: 26,
        name: "Hiking, walks, hang out with friends, library, free local events",
        cost: 0,
        isCheckbox: true,
      },
      { id: 27, name: "TV, snacks, driving around", cost: 1 },
      { id: 28, name: "Going to the movies", cost: 2 },
      { id: 29, name: "Fitness classes/gym membership", cost: 2 },
      { id: 30, name: "Art, photography, music hobbies", cost: 2 },
      { id: 31, name: "Vacations / Travel", cost: 3 },
    ],
  },
  {
    id: 8,
    name: "PERSONAL CARE",
    required: false,
    color: "blue",
    items: [
      {
        id: 32,
        name: "Basic hygiene: shampoo, hair product, make-up",
        cost: 1,
      },
      {
        id: 33,
        name: "Occasional hair cuts, hair coloring, or nail appointments",
        cost: 2,
      },
      {
        id: 34,
        name: "Regular professional hair/nail appointments, high-end makeup",
        cost: 3,
      },
    ],
  },
  {
    id: 9,
    name: "FOOD",
    required: true,
    color: "red",
    items: [
      {
        id: 35,
        name: "Eat at home, pack lunch, dinner out once per week",
        cost: 2,
      },
      {
        id: 36,
        name: "Fast food lunches, dinner out once per week, other meals at home",
        cost: 3,
      },
      { id: 37, name: "All meals out", cost: 4 },
    ],
  },
  {
    id: 10,
    name: "CLOTHES & LAUNDRY",
    required: true,
    color: "red",
    items: [
      { id: 38, name: "Wear what you have", cost: 0, isCheckbox: true },
      { id: 39, name: "Shop at thrift stores", cost: 1 },
      { id: 40, name: "Shop clearance racks", cost: 1 },
      { id: 41, name: "Buy one new item per month, full price", cost: 2 },
      { id: 42, name: "Buy two new items per month, full price", cost: 3 },
      {
        id: 43,
        name: "Do laundry at parents' or friends' home",
        cost: 0,
        isCheckbox: true,
      },
      { id: 44, name: "Go to a laundromat", cost: 1 },
      { id: 45, name: "Your apartment has a washer and dryer", cost: 1 },
    ],
  },
  {
    id: 11,
    name: "TRANSPORTATION",
    required: true,
    color: "red",
    items: [
      { id: 46, name: "Walk or Bike", cost: 0, isCheckbox: true },
      { id: 47, name: "Ride the bus or train", cost: 1 },
      { id: 48, name: "Drive family car, buy gas", cost: 2 },
      { id: 49, name: "Buy a used car & buy gas", cost: 3 },
      { id: 50, name: "Buy a new car & buy gas", cost: 4 },
    ],
  },
  {
    id: 12,
    name: "EXTRAS",
    required: false,
    color: "purple",
    items: [
      { id: 51, name: "Extra TV channels", cost: 1 },
      { id: 52, name: "Movie club subscription", cost: 1 },
      { id: 53, name: "Software or gaming subscription", cost: 2 },
    ],
  },
];

export const REQUIRED_CATEGORIES = CATEGORIES.filter((cat) => cat.required).map(
  (cat) => cat.name
);

export const ROUNDS = {
  1: {
    beans: 20,
    message: "Round 1: Spend all 20 jellybeans.",
    canAdd: true,
    canRemove: true,
  },
  2: {
    beans: 13,
    message:
      "Round 2: Your income has been cut to 13 jellybeans!\nRemove 7 jellybeans to continue.",
    canAdd: true,
    canRemove: true,
  },
  3: {
    beans: 13,
    message:
      "Round 3: Someone in your family broke their leg. ☹️ If you do not have insurance, remove 3 jellybeans.",
    canAdd: true,
    canRemove: true,
  },
  4: {
    beans: 15,
    message:
      "Final Round: You have received a raise of 2 jellybeans! Spend them to finish the game.",
    canAdd: true,
    canRemove: true,
  },
};

// Helper function to get category by item ID
export const getCategoryByItemId = (itemId) => {
  return CATEGORIES.find((category) =>
    category.items.some((item) => item.id === itemId)
  );
};
